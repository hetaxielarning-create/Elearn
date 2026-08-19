const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['note', 'pdf', 'video', 'text'], default: 'text' },
    content: { type: String },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    // NEW: Materials can optionally be linked to a chapter, topic, and subtopic
// Existing materials will continue to work as before
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    topicId: { type: mongoose.Schema.Types.ObjectId },
    subtopicId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema);
