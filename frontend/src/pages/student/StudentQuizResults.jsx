// =================================================================
// --- IMPORTS & SETUP ---
// =================================================================
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './StudentQuiz.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const StudentQuizResults = () => {
  // --- HOOKS & STATE ---
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  // --- SIDE EFFECTS (REDIRECT) ---
  useEffect(() => {
    if (!results) {
      navigate('/student/join');
    }
  }, [results, navigate]);

  if (!results) {
    return <div>Loading results...</div>;
  }

  // --- CHART DATA PREPARATION ---
  const chartData = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [
      {
        label: 'Quiz Performance',
        data: [results.correctAnswers, results.incorrectAnswers, results.unanswered],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="results-container">
      <div className="summary-card">
        <h1>{results.quizTitle}</h1>
        <h2>Your Result</h2>
        <p className="score">
          {results.score} / {results.totalQuestions}
        </p>
        <div className="score-details">
          <span>✔️ {results.correctAnswers} Correct</span>
          <span>❌ {results.incorrectAnswers} Incorrect</span>
          <span>❔ {results.unanswered} Unanswered</span>
        </div>
        <div className="chart-container">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="report-container">
        <h2>Answer Breakdown</h2>
        {results.detailedReport.map((item, index) => (
          <div key={index} className="report-question">
            <p><strong>{index + 1}. {item.questionText}</strong></p>
            <p className={`your-answer ${item.isCorrect ? 'correct' : 'incorrect'}`}>
              Your Answer: {item.yourAnswer}
            </p>
            {!item.isCorrect && (
              <p className="correct-answer-text">
                Correct Answer: {item.correctAnswer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentQuizResults;