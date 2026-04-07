// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './QuizCreation.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const CreateQuizDetails = () => {
  // --- STATE MANAGEMENT ---
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    code: '',
    password: '',
    duration: 30,
    subject: '',
    randomizeQuestions: false,
    visibility: 'private',
    availableFrom: '',
    availableUntil: '',
  });
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  // --- SIDE EFFECTS (DATA FETCHING) ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
        if (response.data.length > 0) {
          setQuizDetails(prevDetails => ({ ...prevDetails, subject: response.data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setQuizDetails({ ...quizDetails, [name]: val });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/quizzes', quizDetails);
      const newQuizId = response.data._id;
      navigate(`/teacher/add-questions/${newQuizId}`);
    } catch (error) {
      console.error('Failed to create quiz details:', error);
      alert('Failed to create quiz. The Quiz Code might already be taken.');
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="quiz-creation-container">
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit} className="creation-form">
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input type="text" name="title" id="title" onChange={handleChange} required />
        </div>
        <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select name="subject" id="subject" value={quizDetails.subject} onChange={handleChange}>
                <option value="">-- Select a Subject --</option>
                {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="code">Unique Quiz Code</label>
          <input type="text" name="code" id="code" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Quiz Password (Optional)</label>
          <input type="password" name="password" id="password" onChange={handleChange} />
          <small>Leave blank for a password-free quiz in the repository.</small>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (in minutes)</label>
          <input type="number" name="duration" id="duration" value={quizDetails.duration} onChange={handleChange} required />
        </div>

        <div className="advanced-settings-section">
            <h3>Advanced Settings</h3>
            <div className="form-group-inline">
                <input 
                    type="checkbox" id="randomizeQuestions" name="randomizeQuestions" 
                    checked={quizDetails.randomizeQuestions} onChange={handleChange} 
                />
                <label htmlFor="randomizeQuestions">Randomize question order</label>
            </div>
            <div className="form-group">
                <label>Visibility:</label>
                <div className="form-group-inline">
                    <input type="radio" id="private" name="visibility" value="private" checked={quizDetails.visibility === 'private'} onChange={handleChange} />
                    <label htmlFor="private">Private (Requires code)</label>
                </div>
                <div className="form-group-inline">
                    <input type="radio" id="public" name="visibility" value="public" checked={quizDetails.visibility === 'public'} onChange={handleChange} />
                    <label htmlFor="public">Public (In Repository)</label>
                </div>
            </div>
            <div className="form-group-grid">
                <div className="form-group">
                    <label htmlFor="availableFrom">Available From:</label>
                    <input type="date" id="availableFrom" name="availableFrom" value={quizDetails.availableFrom} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="availableUntil">Available Until:</label>
                    <input type="date" id="availableUntil" name="availableUntil" value={quizDetails.availableUntil} onChange={handleChange} />
                </div>
            </div>
        </div>

        <button type="submit" className="creation-button">Next: Add Questions</button>
      </form>
    </div>
  );
};

export default CreateQuizDetails;