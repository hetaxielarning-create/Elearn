const mongoose = require('mongoose');

// Simple broadcast-style announcements — no per-user read/unread tracking,
// keeps scope reasonable for the dissertation timeline.
const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: {
      type: String,
      enum: ['all', 'students', 'instructors'],
      default: 'all',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
