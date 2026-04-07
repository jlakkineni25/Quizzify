// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api/axiosConfig';

// Register Chart.js components to be used in the line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const StudentProfileView = () => {
  // --- STATE MANAGEMENT ---
  // 'attempts' stores the array of quiz attempts fetched from the API.
  const [attempts, setAttempts] = useState([]);
  // 'loading' tracks the data fetching status to show a loading message.
  const [loading, setLoading] = useState(true);

  // --- SIDE EFFECTS (useEffect) ---
  // This effect runs once when the component mounts to fetch the student's quiz history.
  useEffect(() => {
    const fetchStudentAttempts = async () => {
      try {
        const response = await api.get('/attempts/myattempts');
        // Sort attempts by date to ensure the line chart is in chronological order.
        const sortedAttempts = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setAttempts(sortedAttempts);
      } catch (error) {
        console.error('Failed to fetch student attempts:', error);
      } finally {
        // Set loading to false once the fetch is complete (either success or fail).
        setLoading(false);
      }
    };
    fetchStudentAttempts();
  }, []); // The empty array [] means this effect only runs on the initial render.
  
  // --- EVENT HANDLERS ---
  // Handles the logic for creating and triggering a text file download of a quiz report.
  const handleDownload = (attempt) => {
    const reportContent = `
Quiz Report
==================
Quiz Title: ${attempt.quizTitle}
Taken On: ${new Date(attempt.createdAt).toLocaleString()}
Score: ${attempt.score} / ${attempt.totalQuestions} (${((attempt.score / attempt.totalQuestions) * 100).toFixed(2)}%)

Detailed Breakdown:
-------------------
${attempt.detailedReport.map((item, index) => `
Q${index + 1}: ${item.questionText}
Your Answer: ${item.yourAnswer}
Correct Answer: ${item.correctAnswer}
Result: ${item.isCorrect ? 'Correct' : 'Incorrect'}
`).join('\n')}
`;
    const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-report-${attempt.quizTitle.replace(/\s+/g, '_')}-${attempt._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- RENDER LOGIC ---
  // Show a loading message while data is being fetched.
  if (loading) return <p>Loading your quiz history...</p>;

  // Prepare the data and options for the line chart visualization.
  const chartData = {
    labels: attempts.map(attempt => attempt.quizTitle), // Use quiz titles for the x-axis labels.
    datasets: [
      {
        label: 'Score (%)',
        // Calculate the percentage score for each attempt for the y-axis data.
        data: attempts.map(attempt => (attempt.score / attempt.totalQuestions) * 100),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Your Quiz Performance Over Time' },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100, // Y-axis will go from 0 to 100 for percentages.
        }
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div>
      <h2>My Quiz History</h2>

      {/* Conditionally render the chart only if there's more than one attempt to show progress. */}
      {attempts.length > 1 && (
        <div className="chart-container" style={{ marginBottom: '2rem' }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      )}

      {/* Conditionally render the list of attempts or a message if none exist. */}
      {attempts.length > 0 ? (
        <div className="attempts-list">
          {attempts.map((attempt) => (
            <div key={attempt._id} className="attempt-card">
              <div className="attempt-card-info">
                <h3>{attempt.quizTitle}</h3>
                <p>Score: {attempt.score} / {attempt.totalQuestions}</p>
                <p>Taken on: {new Date(attempt.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleDownload(attempt)} className="download-button">
                Download Report
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not attempted any quizzes yet.</p>
      )}
    </div>
  );
};

export default StudentProfileView;