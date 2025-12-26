const Job = require('../models/jobModel');
const User = require('../models/userModel'); // <--- IMPORT THIS to save resume

// 1. POST A JOB
exports.postJob = async (req, res) => {
    try {
        const { title, company, location, description, salary, requirements, jobType } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            requirements,
            jobType,
            postedBy: req.user.id // Taken from 'protect' middleware
        });

        res.status(201).json({ message: "Job Posted Successfully!", job });
    } catch (error) {
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 2. GET ALL JOBS
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'username email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// 3. APPLY FOR A JOB (UPDATED FOR FILE UPLOAD)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        // Use ID from token (safer) instead of body
        const userId = req.user.id; 

        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume (PDF)" });
        }

        // 2. Normalize path for Windows (replace \ with /)
        const resumePath = req.file.path.replace(/\\/g, "/");

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.applicants.includes(userId)) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // 3. SAVE RESUME TO USER PROFILE
        await User.findByIdAndUpdate(userId, { resume: resumePath });

        // 4. Add user to applicants list
        job.applicants.push(userId);
        await job.save();

        res.json({ message: "Application Successful!", resumePath });
    } catch (error) {
        res.status(500).json({ message: "Error applying for job", error: error.message });
    }
};

// 4. GET APPLICANTS FOR A JOB (UPDATED TO FETCH RESUME)
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findById(jobId).populate({
            path: 'applicants',
            // ADD 'resume' to this list so frontend receives it
            select: 'username email resume' 
        });
        
        if (!job) return res.status(404).json({ message: "Job not found" });

        res.status(200).json({ 
            title: job.title, 
            applicants: job.applicants 
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants", error: error.message });
    }
};

// 5. DELETE A JOB
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this job" });
        }

        await Job.findByIdAndDelete(jobId);
        res.json({ message: "Job Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

// 6. UPDATE A JOB
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const job = await Job.findById(id); 

        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check ownership before updating
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        
        res.json({ message: "Job Updated Successfully!", updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};