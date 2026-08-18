const Course = require('../models/Course');

// MODIFIED: supports ?search=keyword (matches title, case-insensitive)
const getCourses = async (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: 'i' };
  }
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  res.json(courses);
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const course = await Course.create({ title, description, category, createdBy: req.user._id });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ message: 'Course deleted' });
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
