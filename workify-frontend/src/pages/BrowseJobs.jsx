import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // --- STATES FOR MODALS ---
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [uploading, setUploading] = useState(false);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // 1. FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsRes = await axios.get("http://localhost:5004/api/jobs/all");
                if (jobsRes.data.jobs) {
                    setJobs(jobsRes.data.jobs);
                } else if (Array.isArray(jobsRes.data)) {
                    setJobs(jobsRes.data);
                }

                if (token && role === 'seeker') {
                    const userRes = await axios.get("http://localhost:5004/api/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const ids = userRes.data.savedJobs.map(job => job._id);
                    setSavedJobs(ids);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [token, role]);

    // 2. FILTERED JOBS
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    // 3. SAVE/UNSAVE JOB
    const handleSaveJob = async (jobId) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            const res = await axios.post("http://localhost:5004/api/auth/save-job",
                { jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.message === "Job Saved") {
                setSavedJobs(prev => [...prev, jobId]);
            } else {
                setSavedJobs(prev => prev.filter(id => id !== jobId));
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    // 4. APPLY FOR JOB
        const handleApply = async (job) => {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }
        try {
            const userRes = await axios.get("http://localhost:5004/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!userRes.data?.resume) {
                alert("Please upload your resume in your profile before applying.");
                navigate('/profile');
                return;
            }
        } catch (error) {
            alert("Unable to check resume. Please try again.");
            return;
        }
        setSelectedJob(job);
        setIsApplyModalOpen(true);
    };

    const submitApplication = async () => {
        try {
            setUploading(true);
            await axios.post(`http://localhost:5004/api/jobs/apply/${selectedJob._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Application submitted successfully!");
            setIsApplyModalOpen(false);
        } catch (error) {
            console.error("Error applying:", error);
            const errorMessage = error.response?.data?.message || "Error submitting application";
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleWithdraw = async (jobId) => {
        if (window.confirm("Withdraw application?")) {
            try {
                await axios.put(`http://localhost:5004/api/jobs/withdraw/${jobId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsDetailModalOpen(false);
                window.location.reload();
            } catch (error) {
                alert("Error withdrawing");
            }
        }
    };

    // 5. READ MORE MODAL
    const handleReadMore = (job) => {
        setSelectedJob(job);
        setIsDetailModalOpen(true);
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Browse <span className="text-highlight">Jobs</span></h1>
                        <p>Find your next opportunity from top companies</p>
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

                {/* SEARCH AND FILTERS */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search jobs, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-divider"></div>
                    <input
                        type="text"
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="search-input"
                    />
                    <button className="btn-search-teal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        Search
                    </button>
                </div>

                {/* JOBS LIST */}
                <div className="jobs-grid">
                    {filteredJobs.length === 0 ? (
                        <div className="no-data-msg" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
                            <p style={{fontSize:'1.1rem', color:'#64748b'}}>No jobs found matching your criteria.</p>
                            <Link to="/dashboard" className="btn-primary" style={{display:'inline-block', marginTop:'15px', textDecoration:'none', padding:'10px 20px', borderRadius:'8px'}}>
                                Back to Dashboard
                            </Link>
                        </div>
                    ) : (
                        filteredJobs.map((job) => {
                            const applicants = job.applicants || [];
                            const myApplication = applicants.find(app => {
                                const applicantUserId = typeof app.user === 'string' ? app.user : app.user?._id;
                                return applicantUserId === userId;
                            });
                            const hasApplied = !!myApplication;

                            return (
                            <div key={job._id} className="job-card">
                                <div className="card-header">
                                    <div className="company-logo-wrapper">
                                        {job.logo ? (
                                            <img src={`http://localhost:5004/${job.logo}`} alt="logo" className="real-logo" />
                                        ) : (
                                            <div className="company-logo-placeholder">{job.company.substring(0, 2).toUpperCase()}</div>
                                        )}
                                    </div>
                                    {isLoggedIn && role === 'seeker' && (
                                        <button 
                                            className="action-icon-btn bookmark-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveJob(job._id);
                                            }}
                                            title={savedJobIds.includes(job._id) ? "Remove from saved" : "Save job"}
                                        >
                                            {savedJobIds.includes(job._id) ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <h3 className="job-title">{job.title}</h3>
                                <div className="company-name">{job.company}</div>

                                <div className="tag-container">
                                    <span className="job-tag">{job.jobType}</span>
                                </div>

                                <div className="job-details-row">
                                    <div className="detail-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                        </svg>
                                        {job.location}
                                    </div>
                                    <div className="detail-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9A1.5 1.5 0 0 1 1.5 3H2V1.5a1.5 1.5 0 0 1 1.5-1.5h8.5A1.5 1.5 0 0 1 12.136.326zM5.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5zM5.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5z"/>
                                        </svg>
                                        Rs. {job.salary}
                                    </div>
                                </div>

                                <div className="job-description">
                                    {job.description.length > 120
                                        ? `${job.description.substring(0, 120)}...`
                                        : job.description}
                                </div>

                                {/* --- UPDATED FOOTER WITH READ MORE --- */}
                                <div className="card-footer">
                                    <button 
                                        className="btn-outline"
                                        onClick={() => handleReadMore(job)}
                                    >
                                        Read More
                                    </button>
                                    {isLoggedIn && role === 'seeker' ? (
                                        <button 
                                            className="btn-apply"
                                            onClick={() => handleApply(job)}
                                            disabled={hasApplied}
                                            style={hasApplied ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                        >
                                            {hasApplied ? 'Applied' : 'Apply Now'}
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn-apply"
                                            onClick={() => navigate('/login')}
                                        >
                                            Login to Apply
                                        </button>
                                    )}
                                </div>
                                {/* -------------------------------------- */}
                            </div>
                            );
                        })
                    )}
                </div>

                {/* APPLY MODAL */}
                {isApplyModalOpen && (
                    <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Apply for {selectedJob?.title}</h2>
                        <p>We'll use the resume from your profile.</p>

                        <div className="modal-actions">
                            <button 
                                className="btn-cancel"
                                onClick={() => {
                                    setIsApplyModalOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                                <button 
                                    className="btn-submit"
                                    onClick={submitApplication}
                                    disabled={uploading}
                                    style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                                >
                                    {uploading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAIL MODAL */}
                {isDetailModalOpen && selectedJob && (
                    <div className="modal-overlay">
                        <div className="job-modal-content">
                            <div className="modal-header">
                                <div className="modal-title">
                                    <h2>{selectedJob.title}</h2>
                                    <div className="company">{selectedJob.company} - {selectedJob.location}</div>
                                </div>
                                <button className="btn-close-modal" onClick={() => setIsDetailModalOpen(false)}>X</button>
                            </div>
                            {(() => {
                                const applicants = selectedJob.applicants || [];
                                const myApplication = applicants.find(app => {
                                    const applicantUserId = typeof app.user === 'string' ? app.user : app.user?._id;
                                    return applicantUserId === userId;
                                });
                                const status = myApplication?.status;
                                return status ? (
                                    <div style={{ marginTop: '10px' }}>
                                        <span className="job-tag" style={{
                                            background: status === 'rejected' ? '#fee2e2' : status === 'shortlisted' ? '#d1fae5' : '#fef3c7',
                                            color: status === 'rejected' ? '#dc2626' : status === 'shortlisted' ? '#059669' : '#d97706'
                                        }}>
                                            {status.toUpperCase()}
                                        </span>
                                    </div>
                                ) : null;
                            })()}

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
                                {isLoggedIn && role === 'seeker' ? (
                                    (() => {
                                        const applicants = selectedJob.applicants || [];
                                        const myApplication = applicants.find(app => {
                                            const applicantUserId = typeof app.user === 'string' ? app.user : app.user?._id;
                                            return applicantUserId === userId;
                                        });
                                        const status = myApplication?.status;
                                        const hasApplied = !!myApplication;

                                        if (status === 'rejected') {
                                            return null;
                                        }

                                        if (status === 'pending') {
                                            return (
                                                <button 
                                                    className="btn-withdraw"
                                                    onClick={() => handleWithdraw(selectedJob._id)}
                                                >
                                                    Withdraw
                                                </button>
                                            );
                                        }

                                        if (status === 'shortlisted' || status === 'rejected') {
                                            return null;
                                        }

                                        return (
                                            <button 
                                                className="btn-apply" 
                                                onClick={() => {
                                                    if (hasApplied) return;
                                                    setIsDetailModalOpen(false);
                                                    handleApply(selectedJob);
                                                }}
                                                disabled={hasApplied}
                                                style={hasApplied ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                            >
                                                {hasApplied ? (status || 'Applied') : 'Apply Now'}
                                            </button>
                                        );
                                    })()
                                ) : (
                                    <button 
                                        className="btn-apply" 
                                        onClick={() => navigate('/login')}
                                    >
                                        Login to Apply
                                    </button>
                                )}
                                <button className="btn-outline" onClick={() => setIsDetailModalOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseJobs;
