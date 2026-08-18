const Notification = require('../models/Notification');

// @route GET /api/notifications/my  - filtered to the logged-in user's role
const getMyNotifications = async (req, res) => {
  const audienceFilter =
    req.user.role === 'student'
      ? ['all', 'students']
      : req.user.role === 'instructor'
      ? ['all', 'instructors']
      : ['all', 'students', 'instructors']; // admin sees everything

  const notifications = await Notification.find({ audience: { $in: audienceFilter } }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

// @route GET /api/notifications  (admin - manage all)
const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
};

// @route POST /api/notifications  (admin only)  body: { title, message, audience }
const createNotification = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    const notification = await Notification.create({
      title,
      message,
      audience: audience || 'all',
      createdBy: req.user._id,
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotification = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
};

const deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json({ message: 'Notification deleted' });
};

module.exports = {
  getMyNotifications,
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
};
