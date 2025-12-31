import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/PostJob.css'; // Re-using your clean CSS

const EditJob = () => {
    const { id } = useParams(); // Get the Job ID from the URL
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true); // Loading state
    const [currentLogo, setCurrentLogo] = useState(''); // To show existing logo
    const [logoFile, setLogoFile] = useState(null); // To store NEW logo file

    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        jobType: 'Full-time',
        requirements: ''
    });

    // 1. FETCH DATA ON LOAD
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // Fetch all jobs to find the specific one
                const res = await axios.get("http://localhost:5004/api/jobs/all");
                const jobsList = res.data.jobs || res.data;
                
                // Find the job that matches the ID in the URL
                const foundJob = jobsList.find(j => j._id === id);

                if (foundJob) {
                    console.log("Job Found:", foundJob); // Debug log
                    setJob({
                        title: foundJob.title || '',
                        company: foundJob.company || '',
                        location: foundJob.location || '',
                        salary: foundJob.salary || '',
                        description: foundJob.description || '',
                        jobType: foundJob.jobType || 'Full-time',
                        // Convert Array to String for the input box
                        requirements: Array.isArray(foundJob.requirements) 
                            ? foundJob.requirements.join(', ') 
                            : foundJob.requirements
                    });
                    setCurrentLogo(foundJob.logo); // Set existing logo
                } else {
                    alert("Job not found!");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false); // Stop loading once data is set
            }
        };

        if (id) fetchJobDetails();
    }, [id, navigate]);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', job.title);
            formData.append('company', job.company);
            formData.append('location', job.location);
            formData.append('salary', job.salary);
            formData.append('description', job.description);
            formData.append('jobType', job.jobType);
            formData.append('requirements', job.requirements);

            // Only send logo if user selected a NEW one
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            await axios.put(`http://localhost:5004/api/jobs/update/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Job Updated Successfully!");
            navigate('/dashboard');
        } catch (error) {
            alert("Error updating job: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Job Details...</div>;

    return (
        <div>
            <Navbar />
            <div className="post-job-container">
                <div className="post-job-card">
                    <h2>Edit Job Posting</h2>
                    <p className="subtitle">Edit the details below.</p>

                    <form onSubmit={handleUpdate} className="post-job-form">
                        
                        {/* Title & Company */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Job Title</label>
                                <input 
                                    name="title" 
                                    value={job.title} 
                                    onChange={handleChange} 
                                    className="post-job-input" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input 
                                    name="company" 
                                    value={job.company} 
                                    onChange={handleChange} 
                                    className="post-job-input" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* LOGO PREVIEW & UPDATE */}
                        <div className="form-group">
                            <label>Company Logo</label>
                            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                                {currentLogo && (
                                    <div style={{width: '60px', height: '60px', borderRadius: '10px', overflow:'hidden', border: '1px solid #eee'}}>
                                        <img 
                                            src={`http://localhost:5004/${currentLogo}`} 
                                            alt="Current Logo" 
                                            style={{width: '100%', height: '100%', objectFit: 'contain'}} 
                                        />
                                    </div>
                                )}
                                <div style={{flex: 1}}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="post-job-input file-input-field" 
                                    />
                                    <small style={{color: '#64748b'}}>Upload new image to replace current logo</small>
                                </div>
                            </div>
                        </div>

                        {/* Location & Salary */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    name="location" 
                                    value={job.location} 
                                    onChange={handleChange} 
                                    className="post-job-input" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Salary</label>
                                <input 
                                    name="salary" 
                                    value={job.salary} 
                                    onChange={handleChange} 
                                    className="post-job-input" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Job Type */}
                        <div className="form-group">
                            <label>Employment Type</label>
                            <select 
                                name="jobType" 
                                value={job.jobType} 
                                onChange={handleChange} 
                                className="job-select"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>

                        {/* Requirements */}
                        <div className="form-group">
                            <label>Requirements (Comma Separated)</label>
                            <input 
                                name="requirements" 
                                value={job.requirements} 
                                onChange={handleChange} 
                                className="post-job-input" 
                                required 
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Job Description</label>
                            <textarea 
                                name="description" 
                                rows="6" 
                                value={job.description} 
                                onChange={handleChange} 
                                className="post-job-textarea" 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-submit-job">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJob;