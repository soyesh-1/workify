const express = require('express');
const router = express.Router();

// 1. IMPORT the updateJob controller (You need to create this function in your controller file if you haven't!)
const { 
    postJob, 
    getAllJobs, 
    applyForJob, 
    getJobApplicants,
    updateJob // <--- ADD THIS
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');

// --- ROUTES ---

router.get('/all', getAllJobs);

router.post('/post', protect, postJob);

// 2. ADD THIS ROUTE definition to match your frontend URL (/api/jobs/update/:id)
router.put('/update/:id', protect, updateJob); 

router.post('/apply/:jobId', protect, applyForJob);

router.get('/applicants/:jobId', protect, getJobApplicants);

module.exports = router;