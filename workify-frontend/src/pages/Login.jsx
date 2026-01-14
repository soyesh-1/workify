import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// Import the new CSS file
import '../css/AuthStyles.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5004/api/auth/login", credentials);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('userId', res.data.userId);
            // Removed alert for a smoother experience like the design
            navigate('/dashboard'); 
        } catch (error) {
            alert("Login Failed: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div className="auth-container">
            {/* Left Section - Form */}
            <div className="auth-form-section">
                <div className="form-wrapper">
                    <h1 className="auth-title">Welcome back!</h1>
                    <p className="auth-subtitle">Enter your Credentials to access your account</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email address</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="Enter your email" 
                                onChange={handleChange} 
                                required 
                                className="auth-input" 
                            />
                        </div>
                        
                        <div className="input-group">
                            <div className="label-row">
                                <label className="input-label">Password</label>
                                
                            </div>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Enter your password" 
                                onChange={handleChange} 
                                required 
                                className="auth-input" 
                            />

                        </div>
                        <div className="forgot-password">Forgot password?</div>

                        <div className="checkbox-group">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" className="checkbox-label">Remember for 30 days</label>
                        </div>
                        
                        <button type="submit" className="auth-button">Login</button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Image */}
            <div className="auth-image-section">
                <div className="image-text">
                    <h2>+ We're Hiring +</h2>
                    <h1>JOIN US NOW!</h1>
                </div>
                <img src="/images/auth-illustration.png" alt="Hiring Illustration" className="auth-illustration" />
            </div>
        </div>
    );
};

export default Login;
