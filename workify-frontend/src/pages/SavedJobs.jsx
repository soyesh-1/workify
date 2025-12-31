import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css'; // Re-using Dashboard styles

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                // We fetch the user profile which includes the populated 'savedJobs' list
                const res = await axios.get("http://localhost:5004/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data.savedJobs) {
                    setSavedJobs(res.data.savedJobs);
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    // Function to Unsave (Remove) a job
    const handleRemoveJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                "http://localhost:5004/api/auth/save-job",
                { jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove from local state immediately
            setSavedJobs(prev => prev.filter(job => job._id !== jobId));
        } catch (error) {
            alert("Failed to remove job");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Your <span className="text-highlight">Saved Jobs</span></h1>
                        <p>Review the opportunities you have bookmarked.</p>
                    </div>
                </div>

                <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{marginBottom: '20px'}}>
                    ← Back to Dashboard
                </button>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="jobs-grid">
                        {savedJobs.length > 0 ? (
                            savedJobs.map((job) => (
                                <div key={job._id} className="job-card">
                                    <div className="card-header">
                                        <div className="company-logo">{job.company.substring(0, 2).toUpperCase()}</div>
                                        <button 
                                            className="btn-icon"
                                            onClick={() => handleRemoveJob(job._id)}
                                            title="Remove from Saved"
                                            style={{color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer'}}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="company-name">{job.company}</div>

                                    <div className="tag-container">
                                        <span className="job-tag">{job.jobType}</span>
                                    </div>

                                    <div className="job-details-row">
                                        <div className="detail-item">{job.location}</div>
                                        <div className="detail-item">Rs. {job.salary}</div>
                                    </div>

                                    <div className="card-footer">
                                        <button 
                                            className="btn-primary btn-apply"
                                            onClick={() => navigate('/dashboard')} // Direct them back to dashboard to apply
                                        >
                                            Go to Apply
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data-msg">
                                <p>You haven't saved any jobs yet.</p>
                                <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{marginTop: '10px'}}>
                                    Browse Jobs
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;