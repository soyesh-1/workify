import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // --- STATES FOR MODALS ---
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false); // For Resume Upload
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // For "Read More"
    const [selectedJob, setSelectedJob] = useState(null); // The job clicked
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

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

    // 2. HANDLERS
    const handleSaveJob = async (jobId) => {
        if (!token) return navigate('/login');
        try {
            const res = await axios.post("http://localhost:5004/api/auth/save-job", { jobId }, { headers: { Authorization: `Bearer ${token}` } });
            setSavedJobs(res.data.savedJobs);
        } catch (error) { alert("Could not save job."); }
    };

    // --- OPEN READ MORE MODAL ---
    const openReadMore = (job) => {
        setSelectedJob(job);
        setIsDetailModalOpen(true);
    };

    // --- OPEN APPLY MODAL ---
    const openApply = (job) => {
        setSelectedJob(job);
        setIsApplyModalOpen(true);
        setResumeFile(null);
    };

    // --- CLOSE MODALS ---
    const closeModals = () => {
        setIsApplyModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedJob(null);
    };

    const submitApplication = async () => {
        if (!resumeFile) return alert("Please select a PDF resume.");
        const formData = new FormData();
        formData.append('resume', resumeFile); 
        formData.append('userId', userId);

        setUploading(true);
        try {
            await axios.post(`http://localhost:5004/api/jobs/apply/${selectedJob._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` }
            });
            alert("Application Submitted!");
            closeModals();
            window.location.reload(); 
        } catch (error) {
            alert(error.response?.data?.message || "Error applying");
        } finally {
            setUploading(false);
        }
    };

    const handleWithdraw = async (jobId) => {
        if (window.confirm("Withdraw application?")) {
            try {
                await axios.put(`http://localhost:5004/api/jobs/withdraw/${jobId}`, {}, { headers: { "Authorization": `Bearer ${token}` } });
                window.location.reload();
            } catch (error) { alert("Error withdrawing"); }
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Delete this job?")) {
            try {
                await axios.delete(`http://localhost:5004/api/jobs/delete/${jobId}`, { headers: { "Authorization": `Bearer ${token}` } });
                setJobs(jobs.filter(j => j._id !== jobId));
            } catch (error) { alert("Error deleting"); }
        }
    };

    // 3. FILTER & HELPERS
    const filteredJobs = jobs.filter(job => {
        const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || job.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const locationMatch = job.location?.toLowerCase().includes(locationFilter.toLowerCase());
        return titleMatch && locationMatch;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: { background: '#fef3c7', color: '#d97706', label: 'Pending' },
            shortlisted: { background: '#d1fae5', color: '#059669', label: 'Shortlisted' },
            rejected: { background: '#fee2e2', color: '#dc2626', label: 'Rejected' }
        };
        const s = styles[status] || styles.pending;
        return <span style={{fontSize:'0.7rem', fontWeight:'700', padding:'4px 8px', borderRadius:'4px', backgroundColor:s.background, color:s.color, marginLeft:'10px', textTransform:'uppercase'}}>{s.label}</span>;
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Hello, <span className="text-highlight">{role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span></h1>
                        <p>Find the perfect job that matches your skills.</p>
                    </div>
                    <div className="stats-row">
                        <div className="stat-card"><span className="stat-number">{filteredJobs.length}</span><span className="stat-label">Active Jobs</span></div>
                        {role === 'recruiter' && (
                            <div className="stat-card"><span className="stat-number">{jobs.filter(j => j.postedBy?._id === userId).length}</span><span className="stat-label">Your Posts</span></div>
                        )}
                    </div>
                </div>

                <div className="search-container">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#94a3b8" viewBox="0 0 16 16" style={{marginLeft: '15px'}}>
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <input type="text" placeholder="Job title, keywords..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="search-divider"></div>
                    <input type="text" placeholder="City..." className="search-input" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                    <button className="btn-search-teal">Search</button>
                </div>

                <h2 className="section-title">Latest Opportunities</h2>

                <div className="jobs-grid">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                            const applicants = job.applicants || [];
                            const myApplication = applicants.find(app => app.user === userId);
                            const hasApplied = !!myApplication;
                            const myStatus = myApplication ? myApplication.status : null;
                            const isSaved = savedJobIds.includes(job._id);

                            return (
                                <div key={job._id} className="job-card">
                                    <div className="card-header">
                                        <div className="company-logo-wrapper">
                                            {job.logo ? <img src={`http://localhost:5004/${job.logo}`} alt="logo" className="real-logo"/> : <div className="company-logo-placeholder">{job.company.substring(0,2).toUpperCase()}</div>}
                                        </div>
                                        {role === 'seeker' && !hasApplied && (
                                            <div onClick={() => handleSaveJob(job._id)} className="bookmark-btn" title={isSaved ? "Unsave" : "Save"}>
                                                {isSaved ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#0f766e" viewBox="0 0 16 16"><path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>
                                                )}
                                            </div>
                                        )}
                                        {hasApplied && role === 'seeker' && getStatusBadge(myStatus)}
                                    </div>
                                    
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="company-name">{job.company}</div>

                                    <div className="tag-container">
                                        <span className="job-tag">{job.jobType}</span>
                                        {job.requirements?.slice(0, 2).map((req, i) => <span key={i} className="job-tag">{req}</span>)}
                                    </div>

                                    <div className="job-details-row">
                                        <div className="detail-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg> {job.location}</div>
                                        <div className="detail-item">Rs. {job.salary}</div>
                                    </div>

                                    <div className="job-description">{job.description}</div>

                                    <div className="card-footer">
                                        {role !== 'recruiter' ? (
                                            <>
                                                {hasApplied ? (
                                                    <button className="btn-withdraw" onClick={() => handleWithdraw(job._id)} disabled={myStatus !== 'pending'} style={myStatus !== 'pending' ? {opacity:0.5}: {}}>
                                                        {myStatus === 'pending' ? 'Withdraw' : myStatus}
                                                    </button>
                                                ) : (
                                                    <button className="btn-apply" onClick={() => openApply(job)}>Apply Now</button>
                                                )}
                                                {/* READ MORE BUTTON ADDED HERE */}
                                                {!hasApplied && (
                                                    <button className="btn-outline" onClick={() => openReadMore(job)}>Read More</button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn-outline" onClick={() => navigate(`/job-applicants/${job._id}`)}>Applicants ({applicants.length})</button>
                                                <button className="action-icon-btn edit-bg" onClick={() => navigate(`/edit-job/${job._id}`)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></button>
                                                <button className="action-icon-btn delete-bg" onClick={() => handleDelete(job._id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : ( <p className="no-jobs-message">No jobs found.</p> )}
                </div>
            </div>

            {/* --- 1. RESUME UPLOAD MODAL --- */}
            {isApplyModalOpen && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Apply for {selectedJob?.title}</h3>
                        <p>Upload your resume (PDF)</p>
                        <input type="file" accept="application/pdf" className="file-input" onChange={e => setResumeFile(e.target.files[0])} />
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button className="btn-submit" onClick={submitApplication} disabled={uploading}>{uploading ? "..." : "Submit"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. READ MORE DETAILS MODAL --- */}
            {isDetailModalOpen && selectedJob && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="job-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>{selectedJob.title}</h2>
                                <div className="company">{selectedJob.company} • {selectedJob.location}</div>
                            </div>
                            <button className="btn-close-modal" onClick={closeModals}>✕</button>
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
                            <button className="btn-apply" onClick={() => { closeModals(); openApply(selectedJob); }}>Apply Now</button>
                            <button className="btn-outline" onClick={closeModals}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;