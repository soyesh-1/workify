const express = require('express');
const router = express.Router();

// 1. UPDATE IMPORTS: Add 'getUserProfile' to the list
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

// 2. IMPORT MIDDLEWARE: You need this to check the token
const { protect } = require('../middleware/authMiddleware');


router.post('/signup', registerUser);
router.post('/login', loginUser);

// 3. ADD PROFILE ROUTE: This is a GET request protected by the token
router.get('/profile', protect, getUserProfile);

module.exports = router;