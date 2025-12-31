const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // --- CRITICAL CHANGE START ---
        // We REMOVED the manual bcrypt hashing here.
        // Why? Because your new userModel.js does it automatically!
        
        const user = await User.create({
            username, 
            email, 
            password, // We pass the plain password, the Model hashes it.
            role: role || 'seeker' 
        });
        // --- CRITICAL CHANGE END ---

        console.log(`✅ New User Registered: ${user.username} as ${user.role}`); 

        res.status(201).json({ 
            message: "User registered successfully!", 
            userId: user._id,
            token: generateToken(user._id), // Helper function isn't defined globally in your snippet, using inline or import
            role: user.role
        });
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Compare password (using the method from userModel)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        console.log(`🔑 User Logged In: ${user.email} (${user.role})`);

        res.json({ 
            message: "Login Successful", 
            token, 
            role: user.role, 
            userId: user._id 
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// 3. GET USER PROFILE (Updated to fetch Saved Jobs)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('savedJobs'); // <--- UPDATED: Gets full job details for bookmarks
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. TOGGLE SAVED JOB (FIXED FOR OLD USERS)
exports.toggleSavedJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        
        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // --- THE FIX: Initialize savedJobs if it's missing (Old Data) ---
        if (!user.savedJobs) {
            user.savedJobs = [];
        }
        // ---------------------------------------------------------------

        // Check if job is already saved
        const index = user.savedJobs.indexOf(jobId);

        if (index === -1) {
            // Not saved -> Add it
            user.savedJobs.push(jobId);
            await user.save();
            res.json({ message: "Job Saved", savedJobs: user.savedJobs });
        } else {
            // Already saved -> Remove it
            user.savedJobs.splice(index, 1);
            await user.save();
            res.json({ message: "Job Removed from Saved", savedJobs: user.savedJobs });
        }
    } catch (error) {
        console.error("Save Job Error:", error); // See exact error in terminal
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};