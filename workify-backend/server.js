const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));