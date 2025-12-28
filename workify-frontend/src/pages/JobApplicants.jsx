import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/JobApplicants.css'; // Make sure you created this CSS file in the previous step!

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Applicants
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5004/api/jobs/applicants/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Backend now returns the array directly
                setApplicants(res.data);
            } catch (error) {
                console.error("Error fetching applicants", error);
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    // 2. Handle Status Update (Shortlist / Reject)
    const handleStatusUpdate = async (applicantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5004/api/jobs/status/${jobId}/${applicantId}`,
                { status: newStatus },
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            // Update UI locally (Optimistic update)
            setApplicants(prev => prev.map(app => 
                app.user._id === applicantId ? { ...app, status: newStatus } : app
            ));

            alert(`Candidate marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    // 3. Helper for Status Colors
    const getStatusClass = (status) => {
        switch(status) {
            case 'shortlisted': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="applicants-container">
                {/* Header Section */}
                <div className="applicants-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h2>Applicant Management</h2>
                </div>

                {loading ? (
                    <div style={{textAlign: 'center', marginTop: '50px'}}>Loading candidates...</div>
                ) : applicants.length === 0 ? (
                    <div className="empty-state">
                        <p>No candidates have applied for this position yet.</p>
                    </div>
                ) : (
                    <div className="applicants-table-wrapper">
                        <table className="applicants-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Applied On</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((app) => (
                                    <tr key={app._id}>
                                        {/* CANDIDATE INFO (Nested in app.user) */}
                                        <td>
                                            <div className="candidate-info">
                                                <div className="candidate-avatar">
                                                    {app.user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="candidate-name">{app.user.username}</div>
                                                    <div className="candidate-email">{app.user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DATE */}
                                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>

                                        {/* RESUME LINK */}
                                        <td>
                                            <a 
                                                href={`http://localhost:5004/${app.resume}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="resume-link"
                                            >
                                                View CV ↗
                                            </a>
                                        </td>

                                        {/* STATUS BADGE */}
                                        <td>
                                            <span className={`status-badge ${getStatusClass(app.status)}`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>

                                        {/* ACTION BUTTONS */}
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-icon btn-accept"
                                                    title="Shortlist"
                                                    onClick={() => handleStatusUpdate(app.user._id, 'shortlisted')}
                                                    disabled={app.status === 'shortlisted'}
                                                >
                                                    ✓
                                                </button>
                                                <button 
                                                    className="btn-icon btn-reject"
                                                    title="Reject"
                                                    onClick={() => handleStatusUpdate(app.user._id, 'rejected')}
                                                    disabled={app.status === 'rejected'}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;