import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const JobApplicants = () => {
    const { jobId } = useParams(); // Get ID from URL
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`http://localhost:5004/api/jobs/applicants/${jobId}`);
                setApplicants(res.data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };
        fetchApplicants();
    }, [jobId]);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <h2>Applicants List</h2>
                <p>Here are the people who applied for this job.</p>
                <hr style={{ margin: '20px 0' }} />

                {applicants.length === 0 ? (
                    <p>No applicants yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {applicants.map(user => (
                            <li key={user._id} style={{
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'white'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{user.username}</h4>
                                    <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
                                </div>
                                <button style={{
                                    padding: '8px 15px',
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }} onClick={() => alert(`Email sent to ${user.email}`)}>
                                    Contact
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;