const Attempt = require('../models/Attempt');

// =================================================================
// --- STUDENT ATTEMPT HISTORY ---
// =================================================================

const getStudentAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find({ studentId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('quizId', 'code'); 
        res.json(attempts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getStudentAttempts };