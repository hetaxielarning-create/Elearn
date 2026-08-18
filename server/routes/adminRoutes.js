const express = require('express');
const router = express.Router();
const {
  getStudents,
  deleteStudent,
  getInstructors,
  createInstructor,
  deleteInstructor,
  toggleUserActive,
  getAllResults,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/students', protect, adminOnly, getStudents);
router.delete('/students/:id', protect, adminOnly, deleteStudent);

router.get('/instructors', protect, adminOnly, getInstructors);
router.post('/instructors', protect, adminOnly, createInstructor); // NEW
router.delete('/instructors/:id', protect, adminOnly, deleteInstructor);

router.put('/users/:id/toggle-active', protect, adminOnly, toggleUserActive);

router.get('/results', protect, adminOnly, getAllResults);

module.exports = router;
