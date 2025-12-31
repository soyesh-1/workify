const Job = require('../models/jobModel');
const User = require('../models/userModel'); 

// 1. POST A JOB (Robust & Debug Version)
exports.postJob = async (req, res) => {
    try {
        console.log("📥 Receiving Job Post Request...");
        console.log("📋 Body:", req.body); // See exactly what text data arrived
        console.log("📁 File:", req.file); // See if the logo arrived

        // Destructure and provide default empty strings to prevent crashes
        const { 
            title, 
            company, 
            location, 
            description, 
            salary, 
            requirements = "", // Default to empty string if missing
            jobType 
        } = req.body;

        // SAFE Requirements Handling
        // Even if requirements is undefined, the default above saves us.
        let reqArray = [];
        if (typeof requirements === 'string') {
            reqArray = requirements.split(',').map(r => r.trim()).filter(r => r !== "");
        } else if (Array.isArray(requirements)) {
            reqArray = requirements;
        }

        // Validate Required Fields Manually (to give better error messages)
        if (!title || !company || !location || !description || !salary) {
            console.log("❌ Missing Required Fields");
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            requirements: reqArray,
            jobType,
            postedBy: req.user.id,
            logo: req.file ? req.file.path : null 
        });

        console.log("✅ Job Created Successfully:", job._id);
        res.status(201).json({ message: "Job Posted Successfully!", job });

    } catch (error) {
        console.error("❌ BACKEND CRASH:", error); // This prints the REAL error in your terminal
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 2. GET ALL JOBS
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'username email');
        res.json({ jobs }); 
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

        // Check if already applied
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

// 4. GET APPLICANTS
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findById(jobId).populate('applicants.user', 'username email');
        
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.status(200).json(job.applicants); 
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

// 6. UPDATE A JOB (Safe Update + Logo Support)
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params; 
        const job = await Job.findById(id); 

        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check ownership
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // --- SMART UPDATE: Only update fields if new data is sent ---
        const { title, company, location, description, salary, requirements, jobType } = req.body;
        
        if (title) job.title = title;
        if (company) job.company = company;
        if (location) job.location = location;
        if (description) job.description = description;
        if (salary) job.salary = salary;
        if (jobType) job.jobType = jobType;

        // Handle Requirements Array
        if (requirements) {
            if (typeof requirements === 'string') {
                job.requirements = requirements.split(',').map(r => r.trim()).filter(r => r !== "");
            } else {
                job.requirements = requirements;
            }
        }

        // Handle Logo Update
        if (req.file) {
            job.logo = req.file.path;
        }

        const updatedJob = await job.save();
        res.json({ message: "Job Updated Successfully!", updatedJob });

    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// 7. WITHDRAW APPLICATION
exports.withdrawApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const appIndex = job.applicants.findIndex(
            app => app.user.toString() === userId
        );

        if (appIndex === -1) {
            return res.status(400).json({ message: "You have not applied for this job" });
        }

        job.applicants.splice(appIndex, 1);
        await job.save();

        res.json({ message: "Application withdrawn successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error withdrawing application", error: error.message });
    }
};

// 8. UPDATE APPLICANT STATUS
exports.updateApplicantStatus = async (req, res) => {
    try {
        const { jobId, applicantId } = req.params;
        const { status } = req.body; 

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