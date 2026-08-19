const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

const getStudents = async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  res.json(students);
};

// MODIFIED: Deleting a student now also deletes their quiz results,// results, progress records, enrollments, and certificates. Previously
// only the User document was removed, leaving orphaned data behind.
const deleteStudent = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });
  if (!user) return res.status(404).json({ message: 'Student not found' });

  await Promise.all([
    QuizResult.deleteMany({ student: user._id }),
    Progress.deleteMany({ student: user._id }),
    Enrollment.deleteMany({ student: user._id }),
    Certificate.deleteMany({ student: user._id }),
  ]);

  res.json({ message: 'Student and all related data deleted' });
};

const getInstructors = async (req, res) => {
  const instructors = await User.find({ role: 'instructor' }).select('-password');
  res.json(instructors);
};

const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const instructor = await User.create({ name, email, password, role: 'instructor' });

    res.status(201).json({
      _id: instructor._id,
      name: instructor.name,
      email: instructor.email,
      role: instructor.role,
      isActive: instructor.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInstructor = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id, role: 'instructor' });
  if (!user) return res.status(404).json({ message: 'Instructor not found' });
  res.json({ message: 'Instructor deleted' });
};

const toggleUserActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Admin accounts cannot be deactivated' });
  }

  user.isActive = !user.isActive;
  await user.save();
  res.json({ _id: user._id, name: user.name, isActive: user.isActive });
};

const getAllResults = async (req, res) => {
  const results = await QuizResult.find()
    .populate('student', 'name email')
    .populate('course', 'title')
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });
  res.json(results);
};

module.exports = {
  getStudents,
  deleteStudent,
  getInstructors,
  createInstructor,
  deleteInstructor,
  toggleUserActive,
  getAllResults,
};
