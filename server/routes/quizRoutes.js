const express = require('express');
const router = express.Router();
const {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getMyResults,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { instructorOrAdmin } = require('../middleware/roleCheck'); // MODIFIED: was adminOnly

router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/results/me', protect, getMyResults);
router.get('/:id', protect, getQuizById);
router.post('/', protect, instructorOrAdmin, createQuiz);
router.put('/:id', protect, instructorOrAdmin, updateQuiz);
router.delete('/:id', protect, instructorOrAdmin, deleteQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
