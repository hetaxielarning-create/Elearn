const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true }, // number correct
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    recommendedLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
