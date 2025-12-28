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

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in the database
        const user = await User.create({
            username, 
            email, 
            password: hashedPassword, 
            role: role || 'seeker' // Default to seeker if no role is provided
        });

        // Log to terminal to confirm which database/role is being saved
        console.log(`✅ New User Registered: ${user.username} as ${user.role}`); 

        res.status(201).json({ 
            message: "User registered successfully!", 
            userId: user._id 
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

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Log login activity
        console.log(`🔑 User Logged In: ${user.email} (${user.role})`);

        // Sending token and user info to frontend
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

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id comes from the 'protect' middleware
        // .select('-password') means "give me everything BUT the password"
        const user = await User.findById(req.user.id).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};