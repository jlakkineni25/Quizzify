// =================================================================
// --- IMPORTS ---
// =================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 

// =================================================================
// --- COMPONENT DEFINITION ---
// =================================================================
const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="hero-section">
        <h1 className="hero-title">Welcome to Quizzify </h1>
        <p className="hero-subtitle">
          The ultimate platform for creating, sharing, and taking quizzes.
          Perfect for teachers and students.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">Get Started</Link>
          <Link to="/login" className="cta-button secondary">I have an account</Link>
        </div>
      </header>

      <section className="features-section">
        <h2 className="features-title">Why Choose Quizzify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>For Teachers</h3>
            <p>Easily create custom quizzes, add various question types, and share them with your students using a unique code.</p>
          </div>
          <div className="feature-card">
            <h3>For Students</h3>
            <p>Join quizzes instantly with a code, enjoy a clean and intuitive interface, and get immediate feedback on your performance.</p>
          </div>
          <div className="feature-card">
            <h3>Instant Results</h3>
            <p>Both teachers and students can view detailed results and analytics as soon as a quiz is completed.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;