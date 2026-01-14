const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

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
