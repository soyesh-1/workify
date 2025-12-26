import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/Dashboard.css'; // Reuse your clean teal styles

const ViewApplicants = () => {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5004/api/jobs/applicants/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplicants(res.data.applicants);
                setJobTitle(res.data.title);
            } catch (error) {
                console.error("Error fetching applicants", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id]);

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="content-area">
                <div className="dashboard-top-bar">
                    <div>
                        <h2 className="section-title">Applicants for: <span className="teal-text">{jobTitle}</span></h2>
                        <p>Review candidate profiles and contact information.</p>
                    </div>
                </div>

                <div className="jobs-grid">
                    {applicants.length > 0 ? (
                        applicants.map((app) => (
                            <div key={app._id} className="modern-card">
                                <div className="card-header">
                                    <div className="company-icon">{app.username.charAt(0).toUpperCase()}</div>
                                    <div className="type-pill">Candidate</div>
                                </div>
                                <div className="card-body">
                                    <h3>{app.username}</h3>
                                    <span className="brand-name">📧 {app.email}</span>
                                    <p style={{marginTop: '10px'}}>Interested in joining your team for this position.</p>
                                </div>
                                <div className="card-footer">
                                    <button className="btn-primary btn-apply" onClick={() => window.location = `mailto:${app.email}`}>
                                        Email Candidate
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{gridColumn: '1/-1', textAlign: 'center'}}>No one has applied yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewApplicants;