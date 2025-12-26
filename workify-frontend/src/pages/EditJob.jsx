import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/AuthStyles.css'; // Reusing your clean teal form styles

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
                        requirements: job.requirements.join(', ')
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
        <div className="auth-container">
            <Navbar />
            <div className="auth-card" style={{ marginTop: '50px', maxWidth: '600px' }}>
                <h2 style={{ color: '#14b8a6', textAlign: 'center' }}>Edit Job Posting</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" required />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary (e.g. Rs. 50,000)" required />
                    
                    <select name="jobType" value={formData.jobType} onChange={handleChange}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>

                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" rows="4" required />
                    <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" required />

                    <button type="submit" className="auth-button">Update Job</button>
                    <button type="button" className="auth-button" style={{ backgroundColor: '#64748b', marginTop: '10px' }} onClick={() => navigate('/dashboard')}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditJob;