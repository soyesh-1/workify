import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: '',
        website: '',
        linkedin: '',
        github: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
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
                setProfileData({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    location: res.data.location || '',
                    bio: res.data.bio || '',
                    skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : (res.data.skills || ''),
                    website: res.data.website || '',
                    linkedin: res.data.linkedin || '',
                    github: res.data.github || ''
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage('New password must be at least 6 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5004/api/auth/change-password', 
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage(res.data.message);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error changing password');
        }
    };

    const handlePasswordInputChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5004/api/auth/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
            setMessage('Profile updated');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) {
            setMessage('Please select an image file');
            return;
        }

        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const res = await axios.put('http://localhost:5004/api/auth/avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(prev => ({ ...prev, avatar: res.data.avatar }));
            setAvatarFile(null);
            setMessage('Profile image updated');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error uploading image');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            setMessage('Please select a resume file');
            return;
        }

        setUploadingResume(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const res = await axios.put('http://localhost:5004/api/auth/resume', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(prev => ({ ...prev, resume: res.data.resume }));
            setResumeFile(null);
            setMessage('Resume updated');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error uploading resume');
        } finally {
            setUploadingResume(false);
        }
    };

    if (!user) return <div style={{padding:'20px'}}>Loading profile...</div>;

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>My Profile</h2>
                
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user.avatar ? (
                                <img src={`http://localhost:5004/${user.avatar}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontWeight: 'bold', color: '#64748b' }}>{user.username?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <form onSubmit={handleAvatarUpload}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                                style={{ display: 'block', marginBottom: '8px' }}
                            />
                            <button
                                type="submit"
                                disabled={uploadingAvatar}
                                style={{ padding: '8px 12px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        </form>
                    </div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
                    {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    {user.location && <p><strong>Location:</strong> {user.location}</p>}
                    {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                    {user.skills && user.skills.length > 0 && (
                        <p><strong>Skills:</strong> {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}</p>
                    )}
                    {user.website && <p><strong>Website:</strong> {user.website}</p>}
                    {user.linkedin && <p><strong>LinkedIn:</strong> {user.linkedin}</p>}
                    {user.github && <p><strong>GitHub:</strong> {user.github}</p>}
                    
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                    <h3>Resume</h3>
                    {user.resume && (
                        <button
                            onClick={() => window.open(`http://localhost:5004/${user.resume}`, '_blank')}
                            style={{ padding: '8px 12px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
                        >
                            View Resume
                        </button>
                    )}
                    <form onSubmit={handleResumeUpload}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                            style={{ display: 'block', marginBottom: '8px' }}
                        />
                        <button
                            type="submit"
                            disabled={uploadingResume}
                            style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                    <h3>Profile Settings</h3>
                    <form onSubmit={handleProfileUpdate} style={{ marginTop: '15px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                required
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                required
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                placeholder="Enter phone number"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={profileData.location}
                                onChange={handleProfileChange}
                                placeholder="City, Country"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio:</label>
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleProfileChange}
                                rows="4"
                                placeholder="Short bio"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Skills (comma separated):</label>
                            <input
                                type="text"
                                name="skills"
                                value={profileData.skills}
                                onChange={handleProfileChange}
                                placeholder="React, Node.js, MongoDB"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Website:</label>
                            <input
                                type="url"
                                name="website"
                                value={profileData.website}
                                onChange={handleProfileChange}
                                placeholder="https://example.com"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LinkedIn:</label>
                            <input
                                type="url"
                                name="linkedin"
                                value={profileData.linkedin}
                                onChange={handleProfileChange}
                                placeholder="https://linkedin.com/in/username"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>GitHub:</label>
                            <input
                                type="url"
                                name="github"
                                value={profileData.github}
                                onChange={handleProfileChange}
                                placeholder="https://github.com/username"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ padding: '10px 15px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Save Changes
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                    <h3>Account Settings</h3>
                    
                    <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        style={{ 
                            padding: '10px 15px', 
                            background: showPasswordForm ? '#dc2626' : '#2563eb', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            marginBottom: '15px'
                        }}
                    >
                        {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
                    </button>

                    {message && (
                        <p style={{ 
                            color: message.includes('Error') || message.includes('incorrect') || message.includes('match') ? '#dc2626' : '#16a34a',
                            marginBottom: '15px',
                            fontWeight: 'bold'
                        }}>
                            {message}
                        </p>
                    )}

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordChange} style={{ marginTop: '15px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Current Password:
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    required
                                    minLength="6"
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    Confirm New Password:
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    required
                                    minLength="6"
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <button 
                                type="submit"
                                style={{ 
                                    padding: '10px 15px', 
                                    background: '#16a34a', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Update Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
