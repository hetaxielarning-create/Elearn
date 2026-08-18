const express = require('express');
const router = express.Router();
const {
  issueCertificate,
  getMyCertificates,
  getAllCertificates,
  downloadCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/course/:courseId', protect, issueCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/:id/download', protect, downloadCertificate);
router.get('/', protect, adminOnly, getAllCertificates);

module.exports = router;
