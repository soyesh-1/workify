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

    // MODAL STATES
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    // 1. FETCH JOBS
    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:5004/api/jobs/all");
            
            if (res.data.jobs) {
                setJobs(res.data.jobs);
            } else if (Array.isArray(res.data)) {
                setJobs(res.data);
            } else {
                setJobs([]);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobs([]);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // 2. ACTIONS
    const openApplyModal = (jobId) => {
        setSelectedJobId(jobId);
        setIsModalOpen(true);
        setResumeFile(null); 
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const submitApplication = async () => {
        if (!resumeFile) {
            alert("Please select a PDF resume first.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to apply!");
            return navigate('/login');
        }

        const formData = new FormData();
        formData.append('resume', resumeFile); 
        formData.append('userId', userId);

        setUploading(true);
        try {
            await axios.post(
                `http://localhost:5004/api/jobs/apply/${selectedJobId}`, 
                formData, 
                {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            alert("Application Submitted Successfully!");
            setIsModalOpen(false);
            setResumeFile(null);
            fetchJobs(); 
        } catch (error) {
            const msg = error.response?.data?.message || "Error uploading application";
            alert(msg);
        } finally {
            setUploading(false);
        }
    };

    const handleWithdraw = async (jobId) => {
        if (window.confirm("Are you sure you want to withdraw your application?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5004/api/jobs/withdraw/${jobId}`, {}, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                alert("Application Withdrawn");
                fetchJobs();
            } catch (error) {
                alert(error.response?.data?.message || "Error withdrawing application");
            }
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5004/api/jobs/delete/${jobId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setJobs(jobs.filter(job => job._id !== jobId));
                alert("Job deleted successfully");
            } catch (error) {
                alert(error.response?.data?.message || "Error deleting job");
            }
        }
    };

    // 3. FILTER LOGIC
    const filteredJobs = jobs.filter(job => {
        const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const locationMatch = job.location?.toLowerCase().includes(locationFilter.toLowerCase());
        return titleMatch && locationMatch;
    });

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "JP";

    // --- NEW: Helper for Status Badge (For Job Seekers) ---
    const getStatusBadge = (status) => {
        const styles = {
            pending: { background: '#fef3c7', color: '#d97706', label: 'Pending' },
            shortlisted: { background: '#d1fae5', color: '#059669', label: 'Shortlisted' },
            rejected: { background: '#fee2e2', color: '#dc2626', label: 'Rejected' }
        };
        const s = styles[status] || styles.pending;
        
        return (
            <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: s.background,
                color: s.color,
                marginLeft: '10px',
                textTransform: 'uppercase',
                display: 'inline-block'
            }}>
                {s.label}
            </span>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                {/* HERO HEADER */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Hello, <span className="text-highlight">{role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span></h1>
                        <p>Find the perfect job that matches your skills and passion.</p>
                    </div>
                    <div className="stats-row">
                        <div className="stat-card">
                            <span className="stat-number">{filteredJobs.length}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                        {role === 'recruiter' && (
                            <div className="stat-card">
                                <span className="stat-number">
                                    {jobs.filter(job => job.postedBy?._id === userId).length}
                                </span>
                                <span className="stat-label">Your Posts</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="search-container">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Job title, keywords, or company" 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="search-divider"></div>
                    <input 
                        type="text" 
                        placeholder="City or zip code" 
                        className="search-input"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                    <button className="btn-primary btn-apply search-btn-width">Search</button>
                </div>

                {/* RECRUITER POST BUTTON */}
                {role === 'recruiter' && (
                    <div className="post-job-container">
                        <button onClick={() => navigate('/post-job')} className="btn-primary btn-apply btn-auto-width">
                            + Post New Job
                        </button>
                    </div>
                )}

                <h2 className="section-title">Latest Opportunities</h2>

                <div className="jobs-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                            const applicants = job.applicants || [];
                            
                            // --- NEW LOGIC: FIND MY APPLICATION OBJECT ---
                            // Since applicants is now an array of objects { user, status, resume }
                            // We use .find() to see if the current userId exists in any of those objects
                            const myApplication = applicants.find(app => app.user === userId);
                            const hasApplied = !!myApplication; // true if found
                            const myStatus = myApplication ? myApplication.status : null;

                            return (
                                <div key={job._id} className="job-card">
                                    <div className="card-header">
                                        <div className="company-logo">{getInitials(job.company)}</div>
                                        
                                        {/* If User Applied, show Status Badge instead of bookmark */}
                                        {hasApplied && role === 'seeker' ? (
                                            getStatusBadge(myStatus)
                                        ) : (
                                            <svg className="bookmark-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="company-name">{job.company}</div>

                                    <div className="tag-container">
                                        <span className="job-tag">{job.jobType}</span>
                                        {job.requirements && job.requirements.slice(0, 2).map((req, i) => (
                                            <span key={i} className="job-tag">{req}</span>
                                        ))}
                                    </div>

                                    <div className="job-details-row">
                                        <div className="detail-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                                            {job.location}
                                        </div>
                                        <div className="detail-item"><span>Rs.</span> {job.salary}</div>
                                    </div>

                                    <div className="job-description">{job.description}</div>

                                    <div className="card-footer">
                                        {role !== 'recruiter' ? (
                                            hasApplied ? (
                                                <button 
                                                    className="btn-primary btn-withdraw" 
                                                    onClick={() => handleWithdraw(job._id)}
                                                    // Disable withdrawal if decision is already made
                                                    disabled={myStatus === 'shortlisted' || myStatus === 'rejected'}
                                                    style={ (myStatus === 'shortlisted' || myStatus === 'rejected') ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                                                >
                                                    {myStatus === 'pending' ? 'Withdraw Application' : `Application ${myStatus}`}
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn-primary btn-apply"
                                                    onClick={() => openApplyModal(job._id)}
                                                >
                                                    Apply Now
                                                </button>
                                            )
                                        ) : (
                                            <>
                                                <button className="btn-primary btn-outline" onClick={() => navigate(`/job-applicants/${job._id}`)}>
                                                    Applicants ({applicants.length})
                                                </button>
                                                <button className="action-icon-btn edit-bg" onClick={() => navigate(`/edit-job/${job._id}`)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                                </button>
                                                <button className="action-icon-btn delete-bg" onClick={() => handleDelete(job._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-jobs-message">No jobs found.</p>
                    )}
                </div>
            </div>

            {/* RESUME UPLOAD MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Apply for Job</h3>
                        <p>Please upload your resume to continue.</p>
                        <div className="file-input-wrapper">
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                className="file-input" 
                                onChange={handleFileChange} 
                            />
                            <p className="file-hint">Accepted formats: PDF only (Max 5MB)</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn-submit" onClick={submitApplication} disabled={uploading}>
                                {uploading ? "Uploading..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;