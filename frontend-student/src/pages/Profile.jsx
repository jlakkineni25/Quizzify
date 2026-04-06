// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import TeacherProfileView from './TeacherProfileView';
import StudentProfileView from './StudentProfileView';
import './Profile.css';
import './auth/AuthForm.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const Profile = () => {
  // --- STATE & CONTEXT ---
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    dateOfBirth: '',
    teacherId: '',
  });
  const [message, setMessage] = useState('');

  // --- SIDE EFFECTS ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const userData = response.data;
        if (userData.dateOfBirth) {
          userData.dateOfBirth = new Date(userData.dateOfBirth).toISOString().split('T')[0];
        }
        setFormData(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.patch('/users/me', formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Profile update failed:', error);
    }
  };
  
  if (!user) {
    return <div>Loading profile...</div>;
  }

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="profile-container">
      <aside className="profile-details-card">
        <h2>My Details</h2>
        <form onSubmit={handleSubmit} className="auth-form" style={{ boxShadow: 'none', padding: 0 }}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} />
          </div>

          {user.role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <input type="text" id="rollNumber" name="rollNumber" value={formData.rollNumber || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
              </div>
            </>
          )}

          {user.role === 'teacher' && (
            <div className="form-group">
              <label htmlFor="teacherId">Teacher ID</label>
              <input type="text" id="teacherId" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} />
            </div>
          )}
          
          <button type="submit" className="auth-button">Update Profile</button>
          {message && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
        </form>
      </aside>

      <main className="role-specific-view">
        {user.role === 'teacher' ? <TeacherProfileView /> : <StudentProfileView />}
      </main>
    </div>
  );
};

export default Profile;