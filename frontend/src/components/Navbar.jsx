// =================================================================
// --- IMPORTS ---
// =================================================================
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const Navbar = () => {
  // --- STATE & CONTEXT ---
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- EVENT HANDLERS ---
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homePath = user 
    ? (user.role === 'teacher' ? '/teacher/dashboard' : '/student/join') 
    : '/';

  // =================================================================
  // --- RENDER ---
  // =================================================================
  return (
    <nav className="navbar">
      <Link to={homePath} className="navbar-brand">Quizzify</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to={homePath}>Home</Link>
            <Link to="/repository">Repository</Link>

            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;