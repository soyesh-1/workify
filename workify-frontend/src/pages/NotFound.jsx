import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ fontSize: '6rem', color: '#14b8a6', marginBottom: '0' }}>404</h1>
                <h2 style={{ fontSize: '2rem', color: '#333' }}>Page Not Found</h2>
                <p style={{ color: '#666', marginTop: '10px' }}>
                    Oops! The page you are looking for doesn't exist or has been moved.
                </p>
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                    style={{ marginTop: '30px', padding: '12px 30px', cursor: 'pointer' }}
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;