// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './AuthForm.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const Register = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', 
    rollNumber: '',
    dateOfBirth: '',
    teacherId: '',
  });
  const navigate = useNavigate();

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. The email might already be in use.');
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" id="name" placeholder="John Doe" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="you@example.com" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="••••••••" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">I am a...</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <>
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input type="text" name="rollNumber" id="rollNumber" placeholder="e.g., 21BCE0001" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" name="dateOfBirth" id="dateOfBirth" onChange={handleChange} />
            </div>
          </>
        )}

        {formData.role === 'teacher' && (
          <div className="form-group">
            <label htmlFor="teacherId">Teacher ID</label>
            <input type="text" name="teacherId" id="teacherId" placeholder="e.g., T-12345" onChange={handleChange} />
          </div>
        )}

        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
};

export default Register;