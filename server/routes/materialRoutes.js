const express = require('express');
const router = express.Router();
const {
  getMaterialsByCourse,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/auth');
const { instructorOrAdmin } = require('../middleware/roleCheck');
const upload = require('../middleware/upload'); // NEW

router.get('/course/:courseId', protect, getMaterialsByCourse);
// Handles file uploads, links, and text submissions
router.post('/', protect, instructorOrAdmin, upload.single('file'), createMaterial);
router.put('/:id', protect, instructorOrAdmin, upload.single('file'), updateMaterial);
router.delete('/:id', protect, instructorOrAdmin, deleteMaterial);

module.exports = router;
