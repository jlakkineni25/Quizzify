// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentJoinQuiz from './pages/student/StudentJoinQuiz';
import StudentAttemptQuiz from './pages/student/StudentAttemptQuiz';
import StudentQuizResults from './pages/student/StudentQuizResults';
import Profile from './pages/Profile';

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



          {/* Student Routes */}
          <Route path="/student/join" element={<StudentJoinQuiz />} />
          <Route path="/student/attempt/:code" element={<StudentAttemptQuiz />} />
          <Route path="/student/results" element={<StudentQuizResults />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;