const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// =================================================================
// --- TEACHER: QUIZ CREATION & CORE MANAGEMENT ---
// =================================================================

exports.createQuiz = async (req, res) => {
  const { 
    title, description, code, password, duration, subject,
    randomizeQuestions, visibility, availableFrom, availableUntil 
  } = req.body;
  
  const createdBy = req.user.id;

  try {
    const quiz = await Quiz.create({ 
      title, description, code, password, duration, subject, createdBy, questions: [],
      randomizeQuestions, visibility, availableFrom, availableUntil
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addQuestionsToQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { questions } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz.createdBy.toString() !== req.user.id) {
        return res.status(401).json({ error: 'User not authorized' });
    }
    quiz.questions.push(...questions);
    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// =================================================================
// --- TEACHER: QUESTION MANAGEMENT ---
// =================================================================

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'Not authorized' }); }
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching quiz' });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'Not authorized' }); }
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ error: 'Error updating quiz' });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'Not authorized' }); }
        await Quiz.findByIdAndDelete(req.params.id);
        await Attempt.deleteMany({ quizId: req.params.id });
        res.json({ message: 'Quiz removed successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting quiz' });
    }
};


exports.getPublicQuiz = async (req, res) => {
  const { code } = req.params;
  try {
    const quiz = await Quiz.findOne({ code }).select('-questions.correctOption');
    if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQuizForStudent = async (req, res) => {
  const { code } = req.params;
  const { password } = req.body;
  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) { return res.status(404).json({ error: 'Quiz not found with that code.' }); }
    if (quiz.password !== password) { return res.status(401).json({ error: 'Incorrect password.' }); }
    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { answers } = req.body;
    const studentId = req.user.id;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        let score = 0, correctAnswers = 0, incorrectAnswers = 0, unanswered = 0;
        const detailedReport = quiz.questions.map((question, index) => {
            const studentAnswerIndex = answers[index];
            const correctAnswerIndex = question.correctOption;
            let isCorrect = false;
            if (studentAnswerIndex === null || studentAnswerIndex === undefined) {
                unanswered++;
            } else if (studentAnswerIndex === correctAnswerIndex) {
                score++; correctAnswers++; isCorrect = true;
            } else {
                incorrectAnswers++;
            }
            return {
                questionText: question.questionText, options: question.options,
                yourAnswer: studentAnswerIndex != null ? question.options[studentAnswerIndex] : 'Unanswered',
                correctAnswer: question.options[correctAnswerIndex], isCorrect,
            };
        });
        const result = {
            quizTitle: quiz.title, totalQuestions: quiz.questions.length, score,
            correctAnswers, incorrectAnswers, unanswered, detailedReport,
        };
        const newAttempt = new Attempt({
          quizId: quiz._id, studentId: studentId, score: result.score,
          totalQuestions: result.totalQuestions, quizTitle: result.quizTitle,
          detailedReport: result.detailedReport,
        });
        await newAttempt.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// =================================================================
// --- DASHBOARD, REPOSITORY & UTILITIES ---
// =================================================================


exports.getTeacherQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 })
            .populate('subject', 'name');
        res.json(quizzes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.downloadQuizQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'User not authorized' }); }
        const header = '"Question Text","Option 1","Option 2","Option 3","Option 4","Correct Option Index"\n';
        const rows = quiz.questions.map(q => {
            const options = q.options.map(opt => `"${opt.replace(/"/g, '""')}"`).join(',');
            return `"${q.questionText.replace(/"/g, '""')}",${options},${q.correctOption}`;
        }).join('\n');
        const csvContent = header + rows;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="quiz-${quiz.code}.csv"`);
        res.status(200).end(csvContent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const { questionText, options, correctOption } = req.body;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'Not authorized' }); }
        const question = quiz.questions.id(questionId);
        if (!question) { return res.status(404).json({ error: 'Question not found' }); }
        question.questionText = questionText;
        question.options = options;
        question.correctOption = correctOption;
        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ error: 'Error updating question' });
    }
};

// =================================================================
// --- STUDENT: QUIZ ATTEMPT FLOW ---
// =================================================================

exports.deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) { return res.status(404).json({ error: 'Quiz not found' }); }
        if (quiz.createdBy.toString() !== req.user.id) { return res.status(401).json({ error: 'Not authorized' }); }
        const question = quiz.questions.id(questionId);
        if (!question) { return res.status(404).json({ error: 'Question not found' }); }
        question.deleteOne();
        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ error: 'Error deleting question' });
    }
};

exports.getQuizRepository = async (req, res) => {
    try {
        const quizzesBySubject = await Quiz.aggregate([
            { $match: { subject: { $exists: true, $ne: null } } },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subjectInfo'
                }
            },
            { $match: { "subjectInfo": { $ne: [] } } },
            { $unwind: '$subjectInfo' },
            {
                $group: {
                    _id: '$subjectInfo.name',
                    quizzes: { 
                        $push: {
                            _id: '$_id',
                            title: '$title',
                            description: '$description',
                            code: '$code',
                            questionCount: { $size: '$questions' },
                            hasPassword: { 
                                $cond: [ { $and: [ { $ifNull: ["$password", false] }, { $ne: ["$password", ""] } ] }, true, false ] 
                            }
                        } 
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subject: '$_id',
                    quizzes: '$quizzes'
                }
            },
            { $sort: { 'subject': 1 } }
        ]);
        res.json(quizzesBySubject);
    } catch (error) {
        console.error("Repository Aggregation Error:", error);
        res.status(400).json({ error: 'Failed to fetch quiz repository' });
    }
};