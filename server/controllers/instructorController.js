const Course = require('../models/Course');
const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');

// @route GET /api/instructor/courses  - only courses this instructor created
const getMyCourses = async (req, res) => {
  const courses = await Course.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
};

// @route GET /api/instructor/courses/:id/results
// Ownership check: only the instructor who created the course (or an admin) can view its results.
const getCourseResults = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (req.user.role !== 'admin' && String(course.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You do not own this course' });
  }

  const results = await QuizResult.find({ course: req.params.id })
    .populate('student', 'name email')
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });
  res.json(results);
};

// @route GET /api/instructor/courses/:id/progress
const getCourseProgress = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (req.user.role !== 'admin' && String(course.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You do not own this course' });
  }

  const progress = await Progress.find({ course: req.params.id }).populate('student', 'name email');
  res.json(progress);
};

module.exports = { getMyCourses, getCourseResults, getCourseProgress };
