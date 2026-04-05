// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api/axiosConfig';

// Register Chart.js components to be used in the bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const TeacherProfileView = () => {
  // --- STATE MANAGEMENT ---
  // 'quizzes' stores the array of quizzes created by the teacher.
  const [quizzes, setQuizzes] = useState([]);
  // 'loading' tracks the data fetching status.
  const [loading, setLoading] = useState(true);

  // --- SIDE EFFECTS (useEffect) ---
  // This effect runs once when the component mounts to fetch the teacher's created quizzes.
  useEffect(() => {
    const fetchTeacherQuizzes = async () => {
      try {
        const response = await api.get('/quizzes/myquizzes');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherQuizzes();
  }, []); // The empty array [] means this effect only runs on the initial render.

  // --- EVENT HANDLERS ---
  // Handles the logic for creating and triggering a CSV file download of a quiz's questions.
  const handleDownload = async (quizId, quizCode) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quiz-questions-${quizCode}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download quiz CSV:', error);
      alert('Failed to download quiz data.');
    }
  };

  // --- RENDER LOGIC ---
  // Show a loading message while data is being fetched.
  if (loading) return <p>Loading your quizzes...</p>;
  
  // Prepare the data and options for the bar chart visualization.
  const chartData = {
    labels: quizzes.map(quiz => quiz.title), // Use quiz titles for the x-axis labels.
    datasets: [
      {
        label: '# of Questions',
        data: quizzes.map(quiz => quiz.questions.length), // Use the number of questions for the y-axis data.
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide the legend as it's redundant for a single dataset.
      title: { display: true, text: 'Number of Questions per Quiz' },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1, // Ensure y-axis shows whole numbers for question counts.
            },
        },
    },
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div>
      <h2>My Created Quizzes</h2>

      {/* Conditionally render the chart only if there are quizzes to display. */}
      {quizzes.length > 0 && (
        <div className="chart-container" style={{ marginBottom: '2rem' }}>
          <Bar options={chartOptions} data={chartData} />
        </div>
      )}
      
      {/* Conditionally render the table of quizzes or a message if none exist. */}
      {quizzes.length > 0 ? (
        <table className="quiz-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Code</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.title}</td>
                <td>{quiz.code}</td>
                <td>{quiz.questions.length}</td>
                <td>
                  <button onClick={() => handleDownload(quiz._id, quiz.code)} className="download-button">
                    Download CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have not created any quizzes yet.</p>
      )}
    </div>
  );
};

export default TeacherProfileView;