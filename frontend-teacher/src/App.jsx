// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherHome from './pages/teacher/TeacherHome';
import CreateQuizDetails from './pages/teacher/CreateQuizDetails';
import AddQuizQuestions from './pages/teacher/AddQuizQuestions';
import Profile from './pages/Profile';
import EditQuizDetails from './pages/teacher/EditQuizDetails';

// Import the new Repository component
import Repository from './pages/Repository';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          {/* ** ADDED THE REPOSITORY ROUTE HERE ** */}
          <Route path="/repository" element={<Repository />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherHome />} />
          <Route path="/teacher/create-quiz" element={<CreateQuizDetails />} />
          <Route path="/teacher/add-questions/:quizId" element={<AddQuizQuestions />} />
          <Route path="/teacher/edit-quiz/:id" element={<EditQuizDetails />} />


        </Routes>
      </main>
    </Router>
  );
}

export default App;