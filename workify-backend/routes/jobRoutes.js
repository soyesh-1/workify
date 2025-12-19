const express = require('express');
const router = express.Router();
// Import the new function
const { postJob, getAllJobs, applyForJob, getJobApplicants } = require('../controllers/jobController');

router.post('/post', postJob);
router.get('/all', getAllJobs);
router.post('/apply/:jobId', applyForJob);
router.get('/applicants/:jobId', getJobApplicants); // <--- NEW ROUTE

module.exports = router;