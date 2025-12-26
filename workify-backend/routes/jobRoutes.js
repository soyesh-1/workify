const express = require('express');
const router = express.Router();
// Import the controller functions
const { postJob, getAllJobs, applyForJob, getJobApplicants } = require('../controllers/jobController');

// 1. IMPORT the protect middleware (Make sure the path matches your folder structure)
const { protect } = require('../middleware/authMiddleware');

// --- ROUTES ---

// Public: Anyone can view jobs
router.get('/all', getAllJobs);

// Protected: Requires a token to post a job
router.post('/post', protect, postJob);

// Protected: Requires a token to apply
router.post('/apply/:jobId', protect, applyForJob);

// Protected: Only logged-in recruiters should see this
router.get('/applicants/:jobId', protect, getJobApplicants);

module.exports = router;