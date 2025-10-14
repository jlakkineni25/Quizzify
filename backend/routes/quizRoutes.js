const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
  createQuiz, addQuestionsToQuiz, getQuizForStudent, getPublicQuiz,
  submitQuiz, getTeacherQuizzes, downloadQuizQuestions, getQuizById,
  updateQuiz, deleteQuiz, updateQuestion, deleteQuestion, getQuizRepository 
} = require('../controllers/quizController');

// =================================================================
// --- PUBLIC & SHARED ROUTES ---
// =================================================================
router.get('/repository', protect, getQuizRepository);

// =================================================================
// --- TEACHER-SPECIFIC ROUTES ---
// =================================================================
router.post('/', protect, createQuiz);
router.get('/myquizzes', protect, getTeacherQuizzes);
router.get('/:id', protect, getQuizById);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);
router.get('/:id/download', protect, downloadQuizQuestions);
router.post('/:quizId/questions', protect, addQuestionsToQuiz);
router.put('/:quizId/questions/:questionId', protect, updateQuestion);
router.delete('/:quizId/questions/:questionId', protect, deleteQuestion);

// =================================================================
// --- STUDENT-SPECIFIC ROUTES ---
// =================================================================
router.post('/student/verify/:code', getQuizForStudent);
router.get('/student/attempt/:code', getPublicQuiz);
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;