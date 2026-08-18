const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/chapterController');
const { protect } = require('../middleware/auth');
const { instructorOrAdmin } = require('../middleware/roleCheck');

router.get('/course/:courseId', protect, getChaptersByCourse);
router.post('/', protect, instructorOrAdmin, createChapter);
router.put('/:chapterId', protect, instructorOrAdmin, updateChapter);
router.delete('/:chapterId', protect, instructorOrAdmin, deleteChapter);

router.post('/:chapterId/topics', protect, instructorOrAdmin, addTopic);
router.put('/:chapterId/topics/:topicId', protect, instructorOrAdmin, updateTopic);
router.delete('/:chapterId/topics/:topicId', protect, instructorOrAdmin, deleteTopic);

router.post('/:chapterId/topics/:topicId/subtopics', protect, instructorOrAdmin, addSubtopic);
router.put('/:chapterId/topics/:topicId/subtopics/:subtopicId', protect, instructorOrAdmin, updateSubtopic);
router.delete('/:chapterId/topics/:topicId/subtopics/:subtopicId', protect, instructorOrAdmin, deleteSubtopic);

module.exports = router;
