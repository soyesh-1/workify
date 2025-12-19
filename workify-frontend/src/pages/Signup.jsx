import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// Import the same CSS file
import '../css/AuthStyles.css';

const Signup = () => {
    const [user, setUser] = useState({ username: '', email: '', password: '', role: 'seeker' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5004/api/auth/signup", user);
            alert("Signup Successful! Please Login.");
            navigate('/login');
        } catch (error) {
            alert("Signup Failed: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div className="auth-container">
            {/* Left Section - Form */}
            <div className="auth-form-section">
                <div className="form-wrapper">
                    <h1 className="auth-title">Create an account</h1>
                    <p className="auth-subtitle">Let's get you started with your job search</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <input 
                                name="username" 
                                placeholder="Enter your username" 
                                onChange={handleChange} 
                                required 
                                className="auth-input" 
                            />
                        </div>
                        
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
                            <label className="input-label">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Create a password" 
                                onChange={handleChange} 
                                required 
                                className="auth-input" 
                            />
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label">I am a...</label>
                            <select name="role" onChange={handleChange} className="auth-input">
                                <option value="seeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                        
                        <button type="submit" className="auth-button">Sign Up</button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Image (Same as Login) */}
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

export default Signup;