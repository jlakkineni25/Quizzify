// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './SubjectsModal.css'; 

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const SubjectsModal = ({ onClose }) => {
  // --- STATE MANAGEMENT ---
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // --- EVENT HANDLERS ---
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const response = await api.post('/subjects', { name: newSubjectName });
      setSubjects([...subjects, response.data]); 
      setNewSubjectName(''); 
    } catch (error) {
      console.error('Failed to create subject', error);
      alert('Failed to create subject.');
    }
  };
  
  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
        try {
            await api.delete(`/subjects/${subjectId}`);
            setSubjects(subjects.filter(s => s._id !== subjectId));
        } catch (error) {
            console.error('Failed to delete subject', error);
            alert('Failed to delete subject. Make sure no quizzes are using it.');
        }
    }
  };

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">&times;</button>
        <h2>Manage Subjects</h2>
        
        <div className="subject-list">
          {loading ? <p>Loading...</p> : subjects.map(subject => (
            <div key={subject._id} className="subject-item">
              <span>{subject.name}</span>
              <button onClick={() => handleDeleteSubject(subject._id)} className="delete-subject-button">Delete</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleCreateSubject} className="create-subject-form">
          <h3>Add New Subject</h3>
          <input 
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="New subject name"
            required
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default SubjectsModal;