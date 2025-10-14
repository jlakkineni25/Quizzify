const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { updateUserProfile, getUserProfile } = require('../controllers/userController');

// =================================================================
// --- USER PROFILE ROUTES ---
// =================================================================

router.get('/me', protect, getUserProfile);

router.patch('/me', protect, updateUserProfile);

module.exports = router;