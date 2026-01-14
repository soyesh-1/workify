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

                {/* --- NEW: Show 'Saved Jobs' only for Seekers --- */}
                {isLoggedIn && role === 'seeker' && (
                    <Link to="/saved-jobs" className="nav-link">Saved Jobs</Link>
                )}
                {/* ---------------------------------------------- */}

                <Link to="/training" className="nav-link">Training</Link>
                <Link to="/faq" className="nav-link">About</Link>
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
                                <span className="account-icon" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
                                    </svg>
                                </span>
                                Account v
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
