// src/pages/Repository.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Repository.css';

const Repository = () => {
  const [groupedQuizzes, setGroupedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await api.get('/quizzes/repository');
        setGroupedQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch repository data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepository();
  }, []);

  // ** NEW FUNCTION FOR SMART NAVIGATION **
  const handleAttempt = (quiz) => {
    if (quiz.hasPassword) {
      // If quiz has a password, go to the join page to enter it
      navigate(`/student/join?code=${quiz.code}`);
    } else {
      // If no password, go directly to the attempt page
      navigate(`/student/attempt/${quiz.code}`);
    }
  };

  if (loading) {
    return <div>Loading Quiz Repository...</div>;
  }

  return (
    <div className="repository-container">
      <header className="repository-header">
        <h1>Quiz Repository</h1>
        <p>Browse all available quizzes by subject to practice and prepare.</p>
      </header>
      
      {groupedQuizzes.length > 0 ? (
        groupedQuizzes.map((group) => (
          <section key={group.subject} className="subject-group">
            <h2 className="subject-title">{group.subject}</h2>
            <div className="quiz-grid">
              {group.quizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p className="quiz-card-meta">{quiz.questionCount} Questions</p>
                  <p className="quiz-card-description">{quiz.description || 'No description available.'}</p>
                  {/* ** BUTTON NOW USES THE NEW FUNCTION ** */}
                  <button onClick={() => handleAttempt(quiz)} className="attempt-quiz-button">
                    Attempt Quiz
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p>No quizzes have been added to the repository yet.</p>
      )}
    </div>
  );
};

export default Repository;