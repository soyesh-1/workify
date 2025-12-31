const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    company:     { type: String, required: true },
    location:    { type: String, required: true },
    description: { type: String, required: true },
    salary:      { type: String, required: true },
    requirements:{ type: [String], required: true }, 
    jobType:     { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], default: 'Full-time' },
    
    // --- NEW: LOGO FIELD ---
    logo: { type: String }, 
    // -----------------------

    postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    applicants:  [{ 
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        resume: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'shortlisted', 'rejected'], 
            default: 'pending' 
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }] 
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);