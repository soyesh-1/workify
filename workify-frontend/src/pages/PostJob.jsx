import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 

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
        try {
            const formattedJob = {
                ...job,
                requirements: job.requirements.split(',').map(req => req.trim())
            };
            await axios.post("http://localhost:5004/api/jobs/post", formattedJob);
            alert("Job Posted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            alert("Error posting job: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
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
    );
};

export default PostJob;