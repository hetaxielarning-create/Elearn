const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const { getRecommendation } = require('../utils/recommendationEngine');

const getQuizzesByCourse = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.correctAnswerIndex');
  res.json(quizzes);
};

const getQuizById = async (req, res) => {
  const isPrivileged = req.user.role === 'admin' || req.user.role === 'instructor';
  const query = Quiz.findById(req.params.id);
  if (!isPrivileged) {
    query.select('-questions.correctAnswerIndex');
  }
  const quiz = await query;
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
};

// MODIFIED: accepts optional level/chapter/topicId alongside the existing fields.
const createQuiz = async (req, res) => {
  try {
    const { course, title, questions, level, chapter, topicId } = req.body;
    const quiz = await Quiz.create({
      course,
      title,
      questions,
      level: level || 'beginner',
      chapter: chapter || undefined,
      topicId: topicId || undefined,
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const updates = { ...req.body };
    ['chapter', 'topicId'].forEach((key) => {
      if (updates[key] === '') updates[key] = undefined;
    });
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json({ message: 'Quiz deleted' });
};

const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Answers do not match number of questions' });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) score += 1;
    });
    const percentage = Math.round((score / quiz.questions.length) * 100);

    const { level, message, materials } = await getRecommendation(percentage, quiz.course);

    const result = await QuizResult.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      recommendedLevel: level,
    });

    await Progress.findOneAndUpdate(
      { student: req.user._id, course: quiz.course },
      {
        $set: { latestScore: percentage, latestLevel: level, lastAttemptDate: new Date() },
        $inc: { quizzesAttempted: 1 },
      },
      { upsert: true, new: true }
    );

    // NEW: include the quiz's own level and topic context in the response
    // so the frontend can build the "Quiz Passed -> Recommended Next
    // Level" messaging without a second round trip.
    res.status(201).json({
      result,
      recommendation: { level, message, materials },
      quizContext: { level: quiz.level, chapter: quiz.chapter, topicId: quiz.topicId, course: quiz.course },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyResults = async (req, res) => {
  const results = await QuizResult.find({ student: req.user._id })
    .populate('course', 'title')
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });
  res.json(results);
};

module.exports = {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getMyResults,
};
