const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. UPDATE IMPORTS: Add 'toggleSavedJob' to the list
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    toggleSavedJob, // <--- NEW IMPORT
    changePassword, // <--- NEW IMPORT
    updateAvatar,
    updateProfile,
    updateResume
} = require('../controllers/authController');

// 2. IMPORT MIDDLEWARE
const { protect } = require('../middleware/authMiddleware');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only images are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

const resumeFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only PDF or Word documents are allowed.'), false);
    }
};

const resumeUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: resumeFilter
});

router.post('/signup', registerUser);
router.post('/login', loginUser);

// 3. PROFILE ROUTE
router.get('/profile', protect, getUserProfile);

// 4. SAVE JOB ROUTE (NEW FOR SPRINT 5)
router.post('/save-job', protect, toggleSavedJob);

// 5. CHANGE PASSWORD ROUTE
router.put('/change-password', protect, changePassword);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.put('/profile', protect, updateProfile);
router.put('/resume', protect, resumeUpload.single('resume'), updateResume);

module.exports = router;
