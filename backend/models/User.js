const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// =================================================================
// --- USER SCHEMA ---
// =================================================================
// Defines the structure for user accounts, including role-specific fields.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  rollNumber: { 
    type: String,
    default: null,
  },
  dateOfBirth: { 
    type: Date,
    default: null,
  },
  teacherId: { 
    type: String,
    default: null,
  },
});

// =================================================================
// --- MIDDLEWARE & METHODS ---
// =================================================================

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema, 'users_quizzify');