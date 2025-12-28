const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. IMPORT Controller Functions
const { 
    postJob, 
    getAllJobs, 
    applyForJob, 
    getJobApplicants,
    updateJob,
    deleteJob,
    withdrawApplication,
    updateApplicantStatus // <--- ADD THIS IMPORT
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');

// --- MULTER SETUP (File Upload Logic) ---

// Ensure 'uploads' directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Accept only PDFs)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Not a PDF! Please upload only PDF files.'), false);
    }
};

// Initialize Upload Middleware (Max size 5MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: fileFilter
});


// --- ROUTES ---

// Public: Anyone can view jobs
router.get('/all', getAllJobs);

// Protected: Post a job
router.post('/post', protect, postJob);

// Protected: Update a job
router.put('/update/:id', protect, updateJob); 

// Protected: Delete a job
router.delete('/delete/:jobId', protect, deleteJob);

// Protected: Withdraw Application
router.put('/withdraw/:jobId', protect, withdrawApplication);

// Protected: Update Applicant Status (Shortlist/Reject) -- NEW ROUTE
router.put('/status/:jobId/:applicantId', protect, updateApplicantStatus);

// Protected: Apply for a job
router.post('/apply/:jobId', protect, upload.single('resume'), applyForJob);

// Protected: View Applicants
router.get('/applicants/:jobId', protect, getJobApplicants);

module.exports = router;