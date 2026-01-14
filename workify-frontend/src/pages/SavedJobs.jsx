import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css'; 

const SavedJobs = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW STATE FOR READ MORE MODAL ---
    const [selectedJob, setSelectedJob] = useState(null); // Stores the job clicked
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
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
    }, [navigate]);

    const handleRemoveJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                "http://localhost:5004/api/auth/save-job",
                { jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSavedJobs(prev => prev.filter(job => job._id !== jobId));
            // Close modal if the removed job was open
            if (selectedJob?._id === jobId) closeModal();
        } catch (error) {
            alert("Failed to remove job");
        }
    };

    // --- MODAL HANDLERS ---
    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
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

                {/* Back Button */}
                <div className="back-nav-wrapper">
                    <Link to="/dashboard" className="btn-back-dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <p style={{textAlign:'center', color:'#64748b'}}>Loading...</p>
                ) : (
                    <div className="jobs-grid">
                        {savedJobs.length > 0 ? (
                            savedJobs.map((job) => (
                                <div key={job._id} className="job-card">
                                    <div className="card-header">
                                        <div className="company-logo-wrapper">
                                            {job.logo ? (
                                                <img src={`http://localhost:5004/${job.logo}`} alt="logo" className="real-logo" />
                                            ) : (
                                                <div className="company-logo-placeholder">{job.company.substring(0, 2).toUpperCase()}</div>
                                            )}
                                        </div>
                                        <button 
                                            className="action-icon-btn delete-bg"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveJob(job._id); }}
                                            title="Remove from Saved"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                            </svg>
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

                                    {/* --- UPDATED FOOTER WITH READ MORE --- */}
                                    <div className="card-footer">
                                        <button 
                                            className="btn-apply"
                                            onClick={() => navigate('/dashboard')} 
                                        >
                                            Apply
                                        </button>
                                        <button 
                                            className="btn-outline"
                                            onClick={() => openModal(job)}
                                        >
                                            Read More
                                        </button>
                                    </div>
                                    {/* -------------------------------------- */}
                                </div>
                            ))
                        ) : (
                            <div className="no-data-msg" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
                                <p style={{fontSize:'1.1rem', color:'#64748b'}}>You haven't saved any jobs yet.</p>
                                <Link to="/dashboard" className="btn-primary" style={{display:'inline-block', marginTop:'15px', textDecoration:'none', padding:'10px 20px', borderRadius:'8px'}}>
                                    Browse Jobs
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- JOB DETAILS MODAL --- */}
            {isModalOpen && selectedJob && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>{selectedJob.title}</h2>
                                <div className="company">{selectedJob.company} - {selectedJob.location}</div>
                            </div>
                            <button className="btn-close-modal" onClick={closeModal}>X</button>
                        </div>

                        <div className="modal-body">
                            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                                <span className="job-tag" style={{background:'#f0fdf4', color:'#15803d'}}>{selectedJob.jobType}</span>
                                <span className="job-tag">Rs. {selectedJob.salary}</span>
                            </div>

                            <h4>Job Description</h4>
                            <p>{selectedJob.description}</p>

                            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                                <>
                                    <h4>Requirements</h4>
                                    <div className="modal-req-list">
                                        {selectedJob.requirements.map((req, i) => (
                                            <span key={i} className="job-tag">{req}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{marginTop:'30px', display:'flex', gap:'10px'}}>
                            <button className="btn-apply" onClick={() => navigate('/dashboard')}>Go to Apply</button>
                            <button className="btn-outline" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
