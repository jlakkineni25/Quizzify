// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './StudentQuiz.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const StudentAttemptQuiz = () => {
  // --- HOOKS & STATE ---
  const { code } = useParams(); 
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- SIDE EFFECTS (DATA FETCHING & TIMER) ---
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/student/attempt/${code}`);
        
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
        setTimeLeft(response.data.duration * 60); 
        setLoading(false);
      } catch (err) {
        setError('Could not load the quiz. Please try again.');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [code]); 

  useEffect(() => {
    if (!quiz || timeLeft <= 0) {
      if (quiz) handleSubmit(); 
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, quiz]);

  // --- EVENT HANDLERS & LOGIC ---
  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setTimeLeft(0); 

    try {
      const response = await api.post(`/quizzes/${quiz._id}/submit`, { answers });
      navigate('/student/results', { state: { results: response.data } });
    } catch (err) {
      setError('There was an error submitting your quiz.');
    }
  };

  if (loading) return <div>Loading Quiz...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // =================================================================
  // --- RENDER ---
  // =================================================================
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const formatTime = (seconds) => {
    if (seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="attempt-quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{quiz.title}</h2>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="question-container">
        <p className="question-text">{currentQuestionIndex + 1}. {currentQuestion.questionText}</p>
        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <li key={index} className="option-item">
              <label className={`option-label ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="option"
                  className="option-input"
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrev} className="nav-button" disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button onClick={handleSubmit} className="nav-button submit-button">
            Submit Quiz
          </button>
        ) : (
          <button onClick={handleNext} className="nav-button">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentAttemptQuiz;