import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Logo: Points to Dashboard if logged in, otherwise Login */}
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="navbar-brand">Workify</Link>
            
            {/* Links */}
            <div className="navbar-center">
                {/* 1. FIX: Home Button Logic */}
                <Link to={isLoggedIn ? "/dashboard" : "/login"} className="nav-link">Home</Link>
                
                <span className="nav-link dropdown-indicator">Browse Jobs</span>
                <span className="nav-link">Training</span>
                <span className="nav-link">About</span>
            </div>

            {/* Buttons */}
            <div className="navbar-auth">
                {isLoggedIn ? (
                    <>
                        {role === 'recruiter' && (
                            <Link to="/post-job" className="nav-btn btn-signup">
                                + Post Job
                            </Link>
                        )}
                        <button onClick={handleLogout} className="nav-btn btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/signup" className="nav-btn btn-signup">Sign Up</Link>
                        <Link to="/login" className="nav-btn btn-login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;