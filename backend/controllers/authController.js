const User = require('../models/User');
const jwt = require('jsonwebtoken');

// =================================================================
// --- TOKEN UTILITY ---
// =================================================================
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// =================================================================
// --- AUTHENTICATION CONTROLLERS ---
// =================================================================

exports.registerUser = async (req, res) => {
  const { name, email, password, role, rollNumber, dateOfBirth, teacherId } = req.body;
  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered. Please log in instead.' });
    }

    const userData = { name, email, password, role };
    if (rollNumber) userData.rollNumber = rollNumber;
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (teacherId) userData.teacherId = teacherId;

    const user = await User.create(userData);
    const token = createToken(user);
    res.status(201).json({ token });
  } catch (error) {
    // Handle MongoDB duplicate key error as a fallback
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This email is already registered. Please log in instead.' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Incorrect email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect email or password' });
    }
    const token = createToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};