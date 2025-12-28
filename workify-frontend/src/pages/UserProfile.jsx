import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const res = await axios.get('http://localhost:5004/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (!user) return <div style={{padding:'20px'}}>Loading profile...</div>;

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>My Profile</h2>
                
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
                    
                    {user.resume && (
                        <div style={{ marginTop: '20px' }}>
                            <button 
                                onClick={() => window.open(`http://localhost:5004/${user.resume}`, '_blank')}
                                style={{ padding: '10px 15px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                            >
                                View My Resume
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;