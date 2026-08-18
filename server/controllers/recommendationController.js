const RecommendationRule = require('../models/RecommendationRule');
const QuizResult = require('../models/QuizResult');
const { getRecommendation } = require('../utils/recommendationEngine');

// @route GET /api/recommendations/course/:courseId  - latest recommendation for logged-in student
const getMyRecommendationForCourse = async (req, res) => {
  const latest = await QuizResult.findOne({ student: req.user._id, course: req.params.courseId }).sort({
    createdAt: -1,
  });
  if (!latest) return res.status(404).json({ message: 'No quiz attempts yet for this course' });

  const recommendation = await getRecommendation(latest.percentage, req.params.courseId);
  res.json(recommendation);
};

// Admin: manage recommendation rules
const getRules = async (req, res) => {
  const rules = await RecommendationRule.find().sort({ minScore: 1 });
  res.json(rules);
};

const createRule = async (req, res) => {
  try {
    const { minScore, maxScore, level, message } = req.body;
    const rule = await RecommendationRule.create({ minScore, maxScore, level, message });
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRule = async (req, res) => {
  const rule = await RecommendationRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!rule) return res.status(404).json({ message: 'Rule not found' });
  res.json(rule);
};

const deleteRule = async (req, res) => {
  const rule = await RecommendationRule.findByIdAndDelete(req.params.id);
  if (!rule) return res.status(404).json({ message: 'Rule not found' });
  res.json({ message: 'Rule deleted' });
};

module.exports = { getMyRecommendationForCourse, getRules, createRule, updateRule, deleteRule };
