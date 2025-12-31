import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // 1. Added Link
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/JobApplicants.css'; 
import '../css/Dashboard.css'; // 2. Import Dashboard CSS for the button styles

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

    // 2. Handle Status Update
    const handleStatusUpdate = async (applicantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5004/api/jobs/status/${jobId}/${applicantId}`,
                { status: newStatus },
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            setApplicants(prev => prev.map(app => 
                app.user._id === applicantId ? { ...app, status: newStatus } : app
            ));

            alert(`Candidate marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'shortlisted': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    return (
        <div>
            {/* 3. Navbar moved OUTSIDE the container to be Full Width */}
            <Navbar />

            <div className="dashboard-container">
                
                {/* 4. CLEAN BACK BUTTON (Solid Teal) */}
                <div className="back-nav-wrapper">
                    <Link to="/dashboard" className="btn-back-dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="applicants-container">
                    {/* Header Section */}
                    <div className="applicants-header">
                        <h2>Applicant Management</h2>
                        <p style={{color: '#64748b', marginTop: '5px'}}>Review and manage candidates for this position.</p>
                    </div>

                    {loading ? (
                        <div style={{textAlign: 'center', marginTop: '50px', color: '#64748b'}}>Loading candidates...</div>
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
                                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
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
                                            <td>
                                                <span className={`status-badge ${getStatusClass(app.status)}`}>
                                                    {app.status.toUpperCase()}
                                                </span>
                                            </td>
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
        </div>
    );
};

export default JobApplicants;