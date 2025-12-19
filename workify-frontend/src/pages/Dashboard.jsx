import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId'); // We need this to check if we applied

    // Function to fetch jobs
    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:5004/api/jobs/all");
            setJobs(res.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // NEW: Handle Apply Logic
    const handleApply = async (jobId) => {
        try {
            await axios.post(`http://localhost:5004/api/jobs/apply/${jobId}`, { userId });
            alert("Application Successful!");
            fetchJobs(); // Refresh the list to update the button to "Applied"
        } catch (error) {
            alert(error.response?.data?.message || "Error applying");
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesTitle = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesTitle && matchesLocation;
    });

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', color: '#333' }}>
                        Welcome, <span style={{ color: '#1DBF73' }}>{role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span>
                    </h1>
                    <p style={{ color: '#666' }}>Find your dream job today.</p>
                </div>

                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search by Job Title or Company" 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Location" 
                        className="search-input"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
                
                {role === 'recruiter' && (
                    <div className="recruiter-section">
                        <h3>Recruiter Dashboard</h3>
                        <p>You have posted {jobs.filter(job => job.postedBy?._id === userId).length} jobs.</p>
                        <button onClick={() => navigate('/post-job')} className="post-job-btn">
                            + Post a New Job
                        </button>
                    </div>
                )}

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

                <h2>{filteredJobs.length} Job Opening{filteredJobs.length !== 1 && 's'} Found</h2>
                
                <div className="jobs-grid">
                    {filteredJobs.map((job) => {
                        // Check if the current user is already in the applicants list
                        const hasApplied = job.applicants.includes(userId);

                        return (
                            <div key={job._id} className="job-card">
                                <h3 className="job-title">{job.title}</h3>
                                <h4 style={{margin: '5px 0'}}>{job.company}</h4>
                                <p className="job-details">📍 {job.location} | 💰 {job.salary}</p>
                                <p>{job.description.substring(0, 100)}...</p>
                                
                                <div className="tag-container">
                                    <span className="job-tag">{job.jobType}</span>
                                    {job.requirements.map((req, index) => (
                                        <span key={index} className="job-tag">{req}</span>
                                    ))}
                                </div>

                                {role === 'seeker' ? (
                                    <button 
                                        className="apply-btn" 
                                        onClick={() => handleApply(job._id)}
                                        disabled={hasApplied} // Disable if already applied
                                        style={{ backgroundColor: hasApplied ? '#6c757d' : '#007bff', cursor: hasApplied ? 'not-allowed' : 'pointer' }}
                                    >
                                        {hasApplied ? "✅ Applied" : "Apply Now"}
                                    </button>
                                ) : (
                                    <button className="view-btn">View Applicants ({job.applicants.length})</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;