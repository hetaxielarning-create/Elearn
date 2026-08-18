const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { instructorOrAdmin } = require('../middleware/roleCheck'); // MODIFIED: was adminOnly

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);
router.post('/', protect, instructorOrAdmin, createCourse);
router.put('/:id', protect, instructorOrAdmin, updateCourse);
router.delete('/:id', protect, instructorOrAdmin, deleteCourse);

module.exports = router;
