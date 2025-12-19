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
    applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);