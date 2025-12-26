import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/PostJob.css';
import Navbar from '../components/Navbar'; // Added Navbar for a complete look

const PostJob = () => {
    const navigate = useNavigate();
    
    // Retrieve storage items
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 

    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        requirements: '',
        jobType: 'Full-time',
        userId: userId
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Security Check: If no token, redirect to login
        if (!token) {
            alert("Session expired. Please login again.");
            return navigate('/login');
        }

        try {
            // Format requirements into an array
            const formattedJob = {
                ...job,
                requirements: job.requirements.split(',').map(req => req.trim())
            };

            // CORRECT IMPLEMENTATION: Added headers with the token
            await axios.post("http://localhost:5004/api/jobs/post", formattedJob, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Job Posted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            // Now correctly catches the "Not authorized" or "Token failed" message
            alert("Error posting job: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div>
            <Navbar /> {/* Consistency with Dashboard */}
            <div className="post-job-container">
                <form onSubmit={handleSubmit} className="post-job-form">
                    <h2>Post a New Job</h2>
                    
                    <input name="title" placeholder="Job Title" onChange={handleChange} required className="post-job-input" />
                    <input name="company" placeholder="Company Name" onChange={handleChange} required className="post-job-input" />
                    <input name="location" placeholder="Location" onChange={handleChange} required className="post-job-input" />
                    <input name="salary" placeholder="Salary" onChange={handleChange} required className="post-job-input" />
                    
                    <select name="jobType" onChange={handleChange} className="post-job-input">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Internship">Internship</option>
                    </select>

                    <textarea name="description" placeholder="Job Description" onChange={handleChange} required className="post-job-textarea" />
                    <input name="requirements" placeholder="Requirements (comma separated)" onChange={handleChange} required className="post-job-input" />

                    <button type="submit" className="submit-job-btn">Post Job</button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;