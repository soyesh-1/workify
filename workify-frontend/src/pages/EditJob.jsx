import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/EditJob.css'; // <--- IMPORT THE NEW CSS FILE HERE

const EditJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        description: '',
        requirements: ''
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5004/api/jobs/all`);
                const job = res.data.find(j => j._id === jobId);
                if (job) {
                    setFormData({
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        salary: job.salary,
                        jobType: job.jobType,
                        description: job.description,
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements
                    });
                }
            } catch (err) {
                console.error("Error fetching job details", err);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedData = {
                ...formData,
                requirements: formData.requirements.split(',').map(req => req.trim())
            };
            await axios.put(`http://localhost:5004/api/jobs/update/${jobId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Job Updated Successfully!");
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="edit-job-container">
                <div className="edit-job-card">
                    <h2 className="edit-job-title">Edit Job Posting</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Job Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="form-input" 
                                value={formData.title} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company</label>
                            <input 
                                type="text" 
                                name="company" 
                                className="form-input" 
                                value={formData.company} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                className="form-input" 
                                value={formData.location} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Salary</label>
                            <input 
                                type="text" 
                                name="salary" 
                                className="form-input" 
                                value={formData.salary} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Type</label>
                            <select 
                                name="jobType" 
                                className="form-select" 
                                value={formData.jobType} 
                                onChange={handleChange}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Requirements (comma separated)</label>
                            <input 
                                type="text" 
                                name="requirements" 
                                className="form-input" 
                                value={formData.requirements} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                name="description" 
                                className="form-textarea" 
                                rows="5" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="btn btn-update">Update Job</button>
                            <button 
                                type="button" 
                                className="btn btn-cancel" 
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJob;