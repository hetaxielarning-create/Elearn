const mongoose = require('mongoose');

// Topics and subtopics are stored inside the chapter document
const subtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // text content, or a link
  order: { type: Number, default: 0 },
});

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  subtopics: { type: [subtopicSchema], default: [] },
});

const chapterSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    topics: { type: [topicSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chapter', chapterSchema);
