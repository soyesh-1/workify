import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css';

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]); 
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5004/api/jobs/applicants/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data && res.data.applicants) {
                    setApplicants(res.data.applicants);
                } else {
                    setApplicants([]);
                }
                setJobTitle(res.data.title || "Position");
            } catch (error) {
                console.error("Error fetching applicants", error);
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    // 1. UPDATE: Function to handle CV download
    const handleDownloadCV = (cvPath) => {
        if (!cvPath) {
            alert("CV not provided by this candidate");
            return;
        }
        // Open the file in a new tab
        // Assuming your backend runs on port 5004
        window.open(`http://localhost:5004/${cvPath}`, '_blank');
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="content-area">
                <div className="dashboard-top-bar">
                    <div>
                        <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{marginBottom: '10px', padding: '5px 15px'}}>
                            ← Back to Dashboard
                        </button>
                        <h2 className="section-title">Applicants for <span className="teal-text">{jobTitle}</span></h2>
                        <p>You have {applicants.length} total candidates for this position.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loader-wrapper"><div className="spinner"></div></div>
                ) : (
                    <div className="applicants-list-container">
                        {applicants.length > 0 ? (
                            <table className="applicants-table">
                                <thead>
                                    <tr>
                                        <th>Candidate Name</th>
                                        <th>Email Address</th>
                                        <th>Phone Number</th>
                                        <th>Applied Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map((app) => (
                                        <tr key={app._id} className="applicant-row">
                                            <td>
                                                <div className="user-info-cell">
                                                    <div className="user-avatar">{app.username.charAt(0).toUpperCase()}</div>
                                                    <span>{app.username}</span>
                                                </div>
                                            </td>
                                            <td>{app.email}</td>
                                            <td>{app.phone || "N/A"}</td>
                                            <td>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "Recently"}</td>
                                            <td className="action-cell">
                                                {/* 2. UPDATE: Pass 'app.resume' instead of 'app.resumePath' */}
                                                <button 
                                                    className="btn-primary btn-apply" 
                                                    style={{fontSize: '0.8rem', padding: '8px 12px'}}
                                                    onClick={() => handleDownloadCV(app.resume)} 
                                                >
                                                    View CV
                                                </button>
                                                <a href={`mailto:${app.email}`} className="email-link-icon" title="Send Email">
                                                    ✉️
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data-msg">
                                <p>No candidates have applied for this position yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;