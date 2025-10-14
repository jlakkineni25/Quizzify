const express = require('express');
const router = express.Router();
const { createSubject, getSubjects, deleteSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

// =================================================================
// --- SUBJECT ROUTES ---
// =================================================================

router.route('/')
    .post(protect, createSubject)
    .get(protect, getSubjects);

router.route('/:id')
    .delete(protect, deleteSubject);

module.exports = router;