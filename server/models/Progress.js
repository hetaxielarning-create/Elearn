const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    latestScore: { type: Number, default: null },
    latestLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: null },
    quizzesAttempted: { type: Number, default: 0 },
    lastAttemptDate: { type: Date },
  },
  { timestamps: true }
);

// One progress doc per student per course
progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
