import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="navbar-brand">Workify</Link>
            
            <div className="navbar-center">
                <Link to={isLoggedIn ? "/dashboard" : "/login"} className="nav-link">Home</Link>
                <Link to="/browse-jobs" className="nav-link">Browse Jobs</Link>
                <span className="nav-link">Training</span>
                <span className="nav-link">About</span>
            </div>

            <div className="navbar-auth">
                {isLoggedIn ? (
                    <>
                        {role === 'recruiter' && (
                            <Link to="/post-job" className="nav-btn btn-signup">
                                + Post Job
                            </Link>
                        )}

                        {/* --- DROPDOWN CONTAINER --- */}
                        <div className="navbar-dropdown-container">
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="btn-account"
                            >
                                👤 Account ▼
                            </button>

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link 
                                        to="/profile" 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        My Profile
                                    </Link>
                                    
                                    <div className="dropdown-divider"></div>
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className="btn-logout-dropdown"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* --------------------------- */}
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