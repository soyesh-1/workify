const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['seeker', 'recruiter'], 
        default: 'seeker' 
    },
    
    // --- NEW: SPRINT 5 - SAVED JOBS ---
    savedJobs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
    }],
    // ----------------------------------

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// --- FIXED SECTION BELOW ---
// Hash password before saving
// We removed 'next' because async functions handle flow control automatically
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// ---------------------------

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);