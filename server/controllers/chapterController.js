const Chapter = require('../models/Chapter');
const Course = require('../models/Course');

// Helper: only the course owner (instructor) or an admin may modify chapters
async function assertOwnership(courseId, user) {
  const course = await Course.findById(courseId);
  if (!course) return { ok: false, status: 404, message: 'Course not found' };
  if (user.role !== 'admin' && String(course.createdBy) !== String(user._id)) {
    return { ok: false, status: 403, message: 'You do not own this course' };
  }
  return { ok: true, course };
}

// @route GET /api/chapters/course/:courseId  - list chapters (with topics/subtopics) for a course
const getChaptersByCourse = async (req, res) => {
  const chapters = await Chapter.find({ course: req.params.courseId }).sort({ order: 1 });
  res.json(chapters);
};

// @route POST /api/chapters  body: { course, title, order }
const createChapter = async (req, res) => {
  try {
    const { course, title, order } = req.body;
    const ownership = await assertOwnership(course, req.user);
    if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

    const chapter = await Chapter.create({ course, title, order: order || 0 });
    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    const ownership = await assertOwnership(chapter.course, req.user);
    if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

    if (req.body.title !== undefined) chapter.title = req.body.title;
    if (req.body.order !== undefined) chapter.order = req.body.order;
    await chapter.save();
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteChapter = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  await chapter.deleteOne();
  res.json({ message: 'Chapter deleted' });
};

// @route POST /api/chapters/:chapterId/topics  body: { title, order }
const addTopic = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    const ownership = await assertOwnership(chapter.course, req.user);
    if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

    chapter.topics.push({ title: req.body.title, order: req.body.order || 0, subtopics: [] });
    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTopic = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  const topic = chapter.topics.id(req.params.topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  if (req.body.title !== undefined) topic.title = req.body.title;
  if (req.body.order !== undefined) topic.order = req.body.order;
  await chapter.save();
  res.json(chapter);
};

const deleteTopic = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  chapter.topics.id(req.params.topicId)?.deleteOne();
  await chapter.save();
  res.json({ message: 'Topic deleted' });
};

// @route POST /api/chapters/:chapterId/topics/:topicId/subtopics  body: { title, content, order }
const addSubtopic = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  const topic = chapter.topics.id(req.params.topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  topic.subtopics.push({
    title: req.body.title,
    content: req.body.content,
    order: req.body.order || 0,
  });
  await chapter.save();
  res.status(201).json(chapter);
};

const updateSubtopic = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  const topic = chapter.topics.id(req.params.topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  const subtopic = topic.subtopics.id(req.params.subtopicId);
  if (!subtopic) return res.status(404).json({ message: 'Subtopic not found' });

  if (req.body.title !== undefined) subtopic.title = req.body.title;
  if (req.body.content !== undefined) subtopic.content = req.body.content;
  if (req.body.order !== undefined) subtopic.order = req.body.order;
  await chapter.save();
  res.json(chapter);
};

const deleteSubtopic = async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const ownership = await assertOwnership(chapter.course, req.user);
  if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message });

  const topic = chapter.topics.id(req.params.topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  topic.subtopics.id(req.params.subtopicId)?.deleteOne();
  await chapter.save();
  res.json({ message: 'Subtopic deleted' });
};

module.exports = {
  getChaptersByCourse,
  createChapter,
  updateChapter,
  deleteChapter,
  addTopic,
  updateTopic,
  deleteTopic,
  addSubtopic,
  updateSubtopic,
  deleteSubtopic,
};
