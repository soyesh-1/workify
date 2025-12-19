const Job = require('../models/jobModel');

// 1. POST A JOB (Only Recruiters)
exports.postJob = async (req, res) => {
    try {
        const { title, company, location, description, salary, requirements, jobType, userId } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            requirements,
            jobType,
            postedBy: userId // We will get this from the logged-in user
        });

        res.status(201).json({ message: "Job Posted Successfully!", job });
    } catch (error) {
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 2. GET ALL JOBS (For Everyone)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'username email'); // Show recruiter details
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// 3. APPLY FOR A JOB (Seeker)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { userId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if user already applied
        if (job.applicants.includes(userId)) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Add user to applicants array
        job.applicants.push(userId);
        await job.save();

        res.json({ message: "Application Successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error applying for job", error: error.message });
    }
};

// 4. GET APPLICANTS FOR A JOB (Recruiter)
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Find job and populate the 'applicants' list with user details
        const job = await Job.findById(jobId).populate('applicants', 'username email');
        
        if (!job) return res.status(404).json({ message: "Job not found" });

        res.json(job.applicants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants", error: error.message });
    }
};