console.log("--- SERVER.JS VERSION 3 --- RUNNING LATEST CODE ---");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// =================================================================
// --- ROUTE IMPORTS ---
// =================================================================
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

const app = express();

// =================================================================
// --- CORE MIDDLEWARE ---
// =================================================================
app.use(cors());
app.use(express.json()); 

// =================================================================
// --- DATABASE CONNECTION ---
// =================================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// =================================================================
// --- API ROUTES SETUP ---
// =================================================================
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/subjects', subjectRoutes);

// =================================================================
// --- SERVER INITIALIZATION ---
// =================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));