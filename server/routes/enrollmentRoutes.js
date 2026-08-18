const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.post('/:courseId', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/course/:courseId/check', protect, checkEnrollment);

module.exports = router;
