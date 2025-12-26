const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    resumePath: { type: String },
    role:     { type: String, enum: ['seeker', 'recruiter'], default: 'seeker' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);