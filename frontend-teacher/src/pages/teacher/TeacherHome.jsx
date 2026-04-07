// src/pages/teacher/TeacherHome.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import SubjectsModal from '../../components/SubjectsModal';
import './TeacherDashboard.css';

const TeacherHome = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
  }, []);

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to permanently delete this quiz? This action cannot be undone.')) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        alert('Quiz deleted successfully.');
      } catch (error) {
        console.error('Failed to delete quiz:', error);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-buttons">
          <button onClick={() => setIsModalOpen(true)} className="manage-subjects-button">
            Manage Subjects
          </button>
          <Link to="/teacher/create-quiz" className="create-quiz-button">
            + Create New Quiz
          </Link>
        </div>
      </div>
      
      <h2>My Quizzes</h2>
      {quizzes.length > 0 ? (
        <table className="quizzes-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th> {/* <-- New Column Header */}
              <th>Code</th>
              <th>Questions</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.title}</td>
                <td>{quiz.subject ? quiz.subject.name : 'N/A'}</td>
                <td>{quiz.code}</td>
                <td>{quiz.questions.length}</td>
                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button 
                    onClick={() => navigate(`/teacher/edit-quiz/${quiz._id}`)} 
                    className="action-button edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(quiz._id)}
                    className="action-button delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't created any quizzes yet. Click the button above to get started!</p>
      )}

      {isModalOpen && <SubjectsModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default TeacherHome;