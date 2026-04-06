// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosConfig';
import '../auth/AuthForm.css';
import './StudentQuiz.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const StudentJoinQuiz = () => {
  // --- STATE & HOOKS ---
  const [formData, setFormData] = useState({ code: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- SIDE EFFECTS ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codeFromUrl = queryParams.get('code');
    if (codeFromUrl) {
      setFormData(prevData => ({ ...prevData, code: codeFromUrl }));
    }
  }, [location.search]); 

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post(`/quizzes/student/verify/${formData.code}`, { 
        password: formData.password 
      });
      navigate(`/student/attempt/${formData.code}`);
    } catch (err) {
      console.error('Failed to join quiz:', err);
      const errorMessage = err.response?.data?.error || 'Failed to join quiz. Please check the code and password.';
      setError(errorMessage);
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="join-quiz-container">
      <h2>Join a Quiz</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="code">Quiz Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button">Start Quiz</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StudentJoinQuiz;