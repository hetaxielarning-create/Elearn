const LearningMaterial = require('../models/LearningMaterial');

// MODIFIED: Added topic, subtopic, and level filters
// to find specific course materials
const getMaterialsByCourse = async (req, res) => {
  const filter = { course: req.params.courseId };
  if (req.query.level) filter.level = req.query.level;
  if (req.query.topicId) filter.topicId = req.query.topicId;
  if (req.query.subtopicId) filter.subtopicId = req.query.subtopicId;
  const materials = await LearningMaterial.find(filter).sort({ createdAt: -1 });
  res.json(materials);
};

// MODIFIED: File upload can also include chapter, topic, and subtopic IDs
const createMaterial = async (req, res) => {
  try {
    const { course, title, type, level, chapter, topicId, subtopicId } = req.body;
    let { content } = req.body;

    if (req.file) {
      content = `/uploads/${req.file.filename}`;
    }

    if (!content) {
      return res.status(400).json({ message: 'Provide either a file upload or a link/text content' });
    }

    const material = await LearningMaterial.create({
      course,
      title,
      type,
      content,
      level,
      chapter: chapter || undefined,
      topicId: topicId || undefined,
      subtopicId: subtopicId || undefined,
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.content = `/uploads/${req.file.filename}`;
    }
    // Clear the field when the dropdown is empty to avoid an ObjectId error
    ['chapter', 'topicId', 'subtopicId'].forEach((key) => {
      if (updates[key] === '') updates[key] = undefined;
    });
    const material = await LearningMaterial.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMaterial = async (req, res) => {
  const material = await LearningMaterial.findByIdAndDelete(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json({ message: 'Material deleted' });
};

module.exports = { getMaterialsByCourse, createMaterial, updateMaterial, deleteMaterial };
