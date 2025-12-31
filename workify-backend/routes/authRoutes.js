const express = require('express');
const router = express.Router();

// 1. UPDATE IMPORTS: Add 'toggleSavedJob' to the list
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    toggleSavedJob // <--- NEW IMPORT
} = require('../controllers/authController');

// 2. IMPORT MIDDLEWARE
const { protect } = require('../middleware/authMiddleware');


router.post('/signup', registerUser);
router.post('/login', loginUser);

// 3. PROFILE ROUTE
router.get('/profile', protect, getUserProfile);

// 4. SAVE JOB ROUTE (NEW FOR SPRINT 5)
router.post('/save-job', protect, toggleSavedJob);

module.exports = router;