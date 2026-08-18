const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    // NEW: mirrors the same optional chapter/topic linking added to
    // LearningMaterial, plus a difficulty level so multiple quizzes on the
    // same topic can be told apart (and grouped/filtered) on the student side.
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    topicId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
