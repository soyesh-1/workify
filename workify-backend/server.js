const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5004; // Updated to match your frontend port 5004
const MONGO_URI = process.env.MONGO_URI;

// Enhanced Connection Logic
mongoose.connect(MONGO_URI, {
    dbName: 'workify' // Forces use of the 'workify' database shown in your Atlas screenshot
})
.then(() => {
    console.log("✅ MongoDB Connected to 'workify' Database");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
});