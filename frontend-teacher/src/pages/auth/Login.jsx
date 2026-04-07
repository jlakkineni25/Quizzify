// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext'; 
import './AuthForm.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const Login = () => {
  // --- STATE & CONTEXT ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;

      login(token);

      const decodedUser = jwtDecode(token);

      if (decodedUser.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/join');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
};

export default Login;