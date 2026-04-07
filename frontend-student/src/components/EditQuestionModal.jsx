// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './EditQuestionModal.css';
import '../pages/teacher/QuizCreation.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const EditQuestionModal = ({ question, quizId, onClose, onQuestionUpdate }) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({ ...question });

  // --- SIDE EFFECTS ---
  // Ensures the form resets if a new question is passed in via props
  useEffect(() => {
    setFormData({ ...question });
  }, [question]);

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/quizzes/${quizId}/questions/${question._id}`, formData);
      const updatedQuestionFromServer = response.data.questions.find(q => q._id === question._id);
      onQuestionUpdate(updatedQuestionFromServer);
      onClose();
    } catch (error) {
      console.error('Failed to update question:', error);
      alert('Failed to update question.');
    }
  };

  if (!question) return null;

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Question</h2>
        <form onSubmit={handleSubmit} className="creation-form">
            <div className="form-group">
                <label>Question Text</label>
                <textarea name="questionText" value={formData.questionText} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Options</label>
                <div className="options-grid">
                    {formData.options.map((opt, index) => (
                        <input key={index} type="text" value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} required />
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label>Correct Option</label>
                <select name="correctOption" value={formData.correctOption} onChange={handleChange}>
                    {formData.options.map((opt, index) => (
                        <option key={index} value={index}>Option {index + 1}</option>
                    ))}
                </select>
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
                <button type="submit" className="button-primary">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;