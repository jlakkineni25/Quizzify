const mongoose = require('mongoose');

// =================================================================
// --- ATTEMPT SCHEMA ---
// =================================================================
// Defines the structure for storing a student's attempt at a quiz.
const attemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  quizTitle: { 
    type: String,
    required: true,
  },
  detailedReport: [{ 
    questionText: String,
    options: [String],
    yourAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);