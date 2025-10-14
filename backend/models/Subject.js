const mongoose = require('mongoose');

// =================================================================
// --- SUBJECT SCHEMA ---
// =================================================================
// Defines the structure for subjects, used to categorize quizzes.
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);