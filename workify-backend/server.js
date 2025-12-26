const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <--- 1. IMPORT PATH MODULE
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- 2. MAKE UPLOADS FOLDER PUBLIC ---
// This tells Express: "If someone asks for /uploads/filename.pdf, look in the uploads folder and send the file."
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5004; 
const MONGO_URI = process.env.MONGO_URI;

// Enhanced Connection Logic
mongoose.connect(MONGO_URI, {
    dbName: 'workify' 
})
.then(() => {
    console.log("✅ MongoDB Connected to 'workify' Database");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
});