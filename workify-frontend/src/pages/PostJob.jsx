import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 

    // Text Data State
    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        requirements: '',
        jobType: 'Full-time'
    });

    // File Data State
    const [logoFile, setLogoFile] = useState(null);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Session expired. Please login again.");
            return navigate('/login');
        }

        try {
            const formData = new FormData();
            formData.append('title', job.title);
            formData.append('company', job.company);
            formData.append('location', job.location);
            formData.append('description', job.description);
            formData.append('salary', job.salary);
            formData.append('jobType', job.jobType);
            formData.append('requirements', job.requirements); 
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            await axios.post("http://localhost:5004/api/jobs/post", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Job Posted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            alert("Error posting job: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div>
            <Navbar />
            <div className="post-job-container">
                <div className="post-job-card">
                    <h2>Post a New Opportunity</h2>
                    <p className="subtitle">Find the best talent for your team by filling out the details below.</p>
                    
                    <form onSubmit={handleSubmit} className="post-job-form">
                        {/* Row 1: Title & Company */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Job Title</label>
                                <input name="title" placeholder="e.g. Senior Frontend Developer" onChange={handleChange} required className="post-job-input" />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input name="company" placeholder="e.g. Tech Solutions Inc." onChange={handleChange} required className="post-job-input" />
                            </div>
                        </div>

                        {/* Row 2: Logo */}
                        <div className="form-group">
                            <label>Company Logo (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="post-job-input file-input-field" 
                            />
                        </div>

                        {/* Row 3: Location & Salary */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <input name="location" placeholder="e.g. Kathmandu, Remote" onChange={handleChange} required className="post-job-input" />
                            </div>
                            <div className="form-group">
                                <label>Salary Range</label>
                                <input name="salary" placeholder="e.g. 50k - 100k" onChange={handleChange} required className="post-job-input" />
                            </div>
                        </div>

                        {/* Row 4: Job Type */}
                        <div className="form-group">
                            <label>Employment Type</label>
                            <select name="jobType" onChange={handleChange} className="job-select">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>

                        {/* Row 5: Requirements */}
                        <div className="form-group">
                            <label>Requirements (Comma Separated)</label>
                            <input name="requirements" placeholder="React, Node.js, MongoDB, Teamwork" onChange={handleChange} required className="post-job-input" />
                        </div>

                        {/* Row 6: Description */}
                        <div className="form-group">
                            <label>Job Description</label>
                            <textarea name="description" rows="6" placeholder="Describe the role, responsibilities, and benefits..." onChange={handleChange} required className="post-job-textarea" />
                        </div>

                        <button type="submit" className="btn-submit-job">Publish Job</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;