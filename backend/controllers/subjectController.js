const Subject = require('../models/Subject');

// =================================================================
// --- TEACHER: SUBJECT MANAGEMENT ---
// =================================================================

const createSubject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const subject = await Subject.create({
            name,
            description,
            createdBy: req.user.id
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create subject' });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ createdBy: req.user.id });
        res.json(subjects);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch subjects' });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        if (subject.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized' });
        }
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject removed' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete subject' });
    }
};

module.exports = { createSubject, getSubjects, deleteSubject };