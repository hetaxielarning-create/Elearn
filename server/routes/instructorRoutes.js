const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  getCourseResults,
  getCourseProgress,
} = require('../controllers/instructorController');
const { protect } = require('../middleware/auth');
const { instructorOrAdmin } = require('../middleware/roleCheck');

router.get('/courses', protect, instructorOrAdmin, getMyCourses);
router.get('/courses/:id/results', protect, instructorOrAdmin, getCourseResults);
router.get('/courses/:id/progress', protect, instructorOrAdmin, getCourseProgress);

module.exports = router;
