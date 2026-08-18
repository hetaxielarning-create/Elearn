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
    // NEW: optional links into the Chapter -> Topic -> Subtopic tree.
    // chapter is a real collection reference; topicId/subtopicId are the
    // _ids of the embedded subdocuments inside that Chapter (topics and
    // subtopics aren't their own collection, so they're referenced by id
    // rather than populate()'d). All optional — existing materials created
    // before this change simply have none of these set, and keep showing
    // up in the flat "Learning Materials" list as before.
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    topicId: { type: mongoose.Schema.Types.ObjectId },
    subtopicId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema);
