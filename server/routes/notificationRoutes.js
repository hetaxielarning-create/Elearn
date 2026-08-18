const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/my', protect, getMyNotifications);
router.get('/', protect, adminOnly, getAllNotifications);
router.post('/', protect, adminOnly, createNotification);
router.put('/:id', protect, adminOnly, updateNotification);
router.delete('/:id', protect, adminOnly, deleteNotification);

module.exports = router;
