const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. IMPORT Controller Functions (Added deleteJob)
const { 
    postJob, 
    getAllJobs, 
    applyForJob, 
    getJobApplicants,
    updateJob,
    deleteJob // <--- ADD THIS
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
        cb(null, uploadDir); // Files will be saved in 'uploads' folder
    },
    filename: function (req, file, cb) {
        // Naming format: resume-jobId-userId-timestamp.pdf
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
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: fileFilter
});


// --- ROUTES ---

// Public: Anyone can view jobs
router.get('/all', getAllJobs);

// Protected: Post a job
router.post('/post', protect, postJob);

// Protected: Update a job (Matches /api/jobs/update/:id)
router.put('/update/:id', protect, updateJob); 

// Protected: Delete a job (Matches /api/jobs/delete/:jobId)
router.delete('/delete/:jobId', protect, deleteJob); // <--- ADD THIS ROUTE

// Protected: Apply for a job (NOW WITH FILE UPLOAD)
// 'resume' must match the formData.append('resume', file) in your React code
router.post('/apply/:jobId', protect, upload.single('resume'), applyForJob);

// Protected: View Applicants
router.get('/applicants/:jobId', protect, getJobApplicants);

module.exports = router;