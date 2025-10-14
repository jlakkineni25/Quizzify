const express = require('express');
const router = express.Router();
const { getStudentAttempts } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

// =================================================================
// --- ATTEMPT ROUTES ---
// =================================================================

router.get('/myattempts', protect, getStudentAttempts);

module.exports = router;