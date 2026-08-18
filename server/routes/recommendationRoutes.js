const express = require('express');
const router = express.Router();
const {
  getMyRecommendationForCourse,
  getRules,
  createRule,
  updateRule,
  deleteRule,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/course/:courseId', protect, getMyRecommendationForCourse);

// Admin manages the IF-THEN rules
router.get('/rules', protect, adminOnly, getRules);
router.post('/rules', protect, adminOnly, createRule);
router.put('/rules/:id', protect, adminOnly, updateRule);
router.delete('/rules/:id', protect, adminOnly, deleteRule);

module.exports = router;
