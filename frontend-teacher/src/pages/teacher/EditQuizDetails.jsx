// src/pages/teacher/EditQuizDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import EditQuestionModal from '../../components/EditQuestionModal';
import './QuizCreation.css';

const EditQuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (err) {
        console.error("Failed to fetch quiz data:", err);
        setError('Could not load quiz data. You may not be the owner of this quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setQuiz({ ...quiz, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { questions, ...detailsToUpdate } = quiz;
      await api.put(`/quizzes/${id}`, detailsToUpdate);
      alert('Quiz details updated successfully!');
    } catch (error) {
      console.error('Failed to update quiz:', error);
      alert('Failed to update quiz. Please try again.');
    }
  };

  const handleOpenEditModal = (question) => {
    setCurrentQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    const updatedQuestions = quiz.questions.map(q => 
        q._id === updatedQuestion._id ? updatedQuestion : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
        try {
            const response = await api.delete(`/quizzes/${quiz._id}/questions/${questionId}`);
            setQuiz(response.data);
        } catch (error) {
            console.error('Failed to delete question', error);
            alert('Failed to delete question.');
        }
    }
  };

  if (loading) return <div>Loading quiz for editing...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <>
      <div className="quiz-creation-container">
        <h2>Edit Quiz</h2>
        <form onSubmit={handleSubmit} className="creation-form">
          {/* --- BASIC DETAILS --- */}
          <div className="form-group">
            <label htmlFor="title">Quiz Title</label>
            <input 
              type="text" name="title" id="title" 
              value={quiz?.title || ''} onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              name="description" id="description" 
              value={quiz?.description || ''} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="code">Unique Quiz Code</label>
            <input 
              type="text" name="code" id="code"
              value={quiz?.code || ''} onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (in minutes)</label>
            <input 
              type="number" name="duration" id="duration" 
              value={quiz?.duration || 0} onChange={handleChange} required 
            />
          </div>

          {/* --- ADVANCED SETTINGS --- */}
          <div className="advanced-settings-section">
              <h3>Advanced Settings</h3>
              <div className="form-group-inline">
                  <input 
                      type="checkbox" id="randomizeQuestions" name="randomizeQuestions" 
                      checked={quiz?.randomizeQuestions || false} onChange={handleChange} 
                  />
                  <label htmlFor="randomizeQuestions">Randomize question order</label>
              </div>
              <div className="form-group">
                  <label>Visibility:</label>
                  <div className="form-group-inline">
                      <input type="radio" id="private" name="visibility" value="private" checked={quiz?.visibility === 'private'} onChange={handleChange} />
                      <label htmlFor="private">Private (Requires code)</label>
                  </div>
                  <div className="form-group-inline">
                      <input type="radio" id="public" name="visibility" value="public" checked={quiz?.visibility === 'public'} onChange={handleChange} />
                      <label htmlFor="public">Public (In Repository)</label>
                  </div>
              </div>
              <div className="form-group-grid">
                  <div className="form-group">
                      <label htmlFor="availableFrom">Available From:</label>
                      <input type="date" id="availableFrom" name="availableFrom" value={formatDateForInput(quiz?.availableFrom)} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                      <label htmlFor="availableUntil">Available Until:</label>
                      <input type="date" id="availableUntil" name="availableUntil" value={formatDateForInput(quiz?.availableUntil)} onChange={handleChange} />
                  </div>
              </div>
          </div>
          <button type="submit" className="creation-button">Save Detail Changes</button>
        </form>

        {/* --- MANAGE QUESTIONS SECTION --- */}
        <div className="manage-questions-section">
            <h2>Manage Questions</h2>
            <div className="questions-list">
                {quiz?.questions && quiz.questions.map((q, index) => (
                    <div key={q._id} className="question-manage-item">
                        <span className="question-text-preview">{index + 1}. {q.questionText}</span>
                        <div className="question-actions">
                            <button onClick={() => handleOpenEditModal(q)} className="action-button edit-button">Edit</button>
                            <button onClick={() => handleDeleteQuestion(q._id)} className="action-button delete-button">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- THE MODAL --- */}
      {isModalOpen && (
        <EditQuestionModal 
            question={currentQuestion}
            quizId={quiz._id}
            onClose={handleCloseModal}
            onQuestionUpdate={handleUpdateQuestion}
        />
      )}
    </>
  );
};

export default EditQuizDetails;