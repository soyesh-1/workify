const Job = require('../models/jobModel');
const User = require('../models/userModel'); 

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
            // Handle comma-separated requirements if sent as string, else use as is
            requirements: typeof requirements === 'string' ? requirements.split(',') : requirements,
            jobType,
            postedBy: req.user.id 
        });

        res.status(201).json({ message: "Job Posted Successfully!", job });
    } catch (error) {
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 2. GET ALL JOBS
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'username email');
        res.json({ jobs }); // Wrap in object to match your frontend expectation
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// 3. APPLY FOR JOB
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id; 
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if already applied (Updated for Object structure)
        const alreadyApplied = job.applicants.find(
            app => app.user.toString() === userId
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // Add applicant object
        job.applicants.push({
            user: userId,
            resume: resumePath,
            status: 'pending'
        });

        await job.save();
        res.status(200).json({ message: "Application submitted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4. GET APPLICANTS (FIXED POPULATE)
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // FIX: Populate 'applicants.user' because applicants is now an array of objects
        const job = await Job.findById(jobId).populate('applicants.user', 'username email');
        
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Security check
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.status(200).json(job.applicants); // Send the array directly
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

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        
        res.json({ message: "Job Updated Successfully!", updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// 7. WITHDRAW APPLICATION (FIXED LOGIC)
exports.withdrawApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Find index of the application
        const appIndex = job.applicants.findIndex(
            app => app.user.toString() === userId
        );

        if (appIndex === -1) {
            return res.status(400).json({ message: "You have not applied for this job" });
        }

        // Remove from array using splice
        job.applicants.splice(appIndex, 1);
        await job.save();

        res.json({ message: "Application withdrawn successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error withdrawing application", error: error.message });
    }
};

// 8. UPDATE APPLICANT STATUS (NEW FUNCTION)
exports.updateApplicantStatus = async (req, res) => {
    try {
        const { jobId, applicantId } = req.params;
        const { status } = req.body; // 'shortlisted' or 'rejected'

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const application = job.applicants.find(
            app => app.user.toString() === applicantId
        );

        if (!application) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        application.status = status;
        await job.save();

        res.json({ message: `Candidate marked as ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};