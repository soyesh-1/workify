const express = require('express');
const router = express.Router();
const { postJob, getAllJobs, applyForJob } = require('../controllers/jobController');

router.post('/post', postJob);
router.get('/all', getAllJobs);
router.post('/apply/:jobId', applyForJob);

module.exports = router;