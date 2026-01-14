const User = require('../models/userModel');
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

        console.log(`New user registered: ${user.username} as ${user.role}`);

        res.status(201).json({ 
            message: "User registered successfully!", 
            userId: user._id,
            token: generateToken(user._id, user.role),
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

        console.log(`User logged in: ${user.email} (${user.role})`);

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

// 5. CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 6. UPDATE AVATAR
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Avatar image is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.avatar = req.file.path;
        await user.save();

        res.json({ message: "Avatar updated", avatar: user.avatar });
    } catch (error) {
        console.error("Avatar Update Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 7. UPDATE RESUME
exports.updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.resume = req.file.path;
        await user.save();

        res.json({ message: "Resume updated", resume: user.resume });
    } catch (error) {
        console.error("Resume Update Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 7. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const {
            username,
            email,
            phone,
            location,
            bio,
            skills,
            website,
            linkedin,
            github
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already in use" });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;
        if (website !== undefined) user.website = website;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (github !== undefined) user.github = github;

        if (skills !== undefined) {
            if (typeof skills === 'string') {
                user.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
            } else if (Array.isArray(skills)) {
                user.skills = skills;
            }
        }

        const updated = await user.save();
        res.json({
            message: "Profile updated",
            user: {
                _id: updated._id,
                username: updated.username,
                email: updated.email,
                role: updated.role,
                avatar: updated.avatar,
                phone: updated.phone,
                location: updated.location,
                bio: updated.bio,
                skills: updated.skills,
                website: updated.website,
                linkedin: updated.linkedin,
                github: updated.github
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};
