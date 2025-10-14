const mongoose = require('mongoose');

// =================================================================
// --- SUB-SCHEMA FOR INDIVIDUAL QUESTIONS ---
// =================================================================
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, 
});

// =================================================================
// --- MAIN QUIZ SCHEMA ---
// =================================================================
// Defines the core structure for a quiz, including its details,
// questions, and advanced settings.
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  password: { type: String }, 
  duration: { type: Number, required: true },
  description: { type: String },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject' 
  },

  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
  },
  availableFrom: {
    type: Date,
  },
  availableUntil: {
    type: Date,
  },

}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);