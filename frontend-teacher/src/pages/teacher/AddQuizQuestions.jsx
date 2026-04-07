// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './QuizCreation.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const AddQuizQuestions = () => {
  // --- HOOKS & STATE ---
  const { quizId } = useParams(); 
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
  });

  // --- EVENT HANDLERS ---
  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, questionText: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };
  
  const handleCorrectOptionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, correctOption: parseInt(e.target.value) });
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0,
    });
  };

  // --- FORM SUBMISSION ---
  const handleFinishQuiz = async () => {
    try {
      await api.post(`/quizzes/${quizId}/questions`, { questions });
      alert('Quiz created successfully!');
      navigate('/teacher/dashboard'); 
    } catch (error) {
      console.error('Failed to add questions:', error);
      alert('An error occurred while saving the questions.');
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="quiz-creation-container">
      <h2>Add Questions - Step 2 of 2</h2>
      <form onSubmit={handleAddQuestion} className="creation-form">
        <div className="form-group">
          <label htmlFor="questionText">Question</label>
          <textarea name="questionText" value={currentQuestion.questionText} onChange={handleQuestionChange} required />
        </div>
        <div className="form-group options-grid">
          {currentQuestion.options.map((option, index) => (
            <input key={index} type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required />
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="correctOption">Correct Option</label>
          <select name="correctOption" value={currentQuestion.correctOption} onChange={handleCorrectOptionChange}>
            {currentQuestion.options.map((option, index) => (
              <option key={index} value={index}>{`Option ${index + 1}`}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="creation-button">Add This Question</button>
      </form>

      <div className="added-questions-list">
        <h3>{questions.length} Question(s) Added</h3>
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <p>{index + 1}. {q.questionText}</p>
            <ul>
              {q.options.map((opt, i) => (
                <li key={i} className={i === q.correctOption ? 'correct-option' : ''}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button onClick={handleFinishQuiz} className="creation-button">
          Finish & Create Quiz
        </button>
      )}
    </div>
  );
};

export default AddQuizQuestions;