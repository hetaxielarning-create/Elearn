const Enrollment = require('../models/Enrollment');

// @route POST /api/enrollments/:courseId
const enrollInCourse = async (req, res) => {
  try {
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId,
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/enrollments/my
const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate(
    'course',
    'title description category'
  );
  res.json(enrollments);
};

// @route GET /api/enrollments/course/:courseId/check
const checkEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  res.json({ enrolled: !!enrollment });
};

module.exports = { enrollInCourse, getMyEnrollments, checkEnrollment };
