const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    company:     { type: String, required: true },
    location:    { type: String, required: true },
    description: { type: String, required: true },
    salary:      { type: String, required: true },
    requirements:{ type: [String], required: true }, 
    jobType:     { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], default: 'Full-time' },
    
    postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // --- UPDATED SECTION ---
    applicants:  [{ 
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        resume: { 
            type: String, 
            required: true // We store the specific resume path for this application
        },
        status: { 
            type: String, 
            enum: ['pending', 'shortlisted', 'rejected'], 
            default: 'pending' // Default status is Pending
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }] 
    // -----------------------

}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);