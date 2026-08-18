const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

function generateCertificateId() {
  // e.g. CERT-9F3A2B1C
  return 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// @route POST /api/certificates/course/:courseId
// A student can only claim a certificate once their tracked progress for
// that course has reached the 'advanced' level (mirrors the dissertation's
// rule-based logic: score > 70% -> advanced -> course considered mastered).
const issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // Total quizzes available in this course
    const totalQuizzes = await Quiz.countDocuments({
      course: courseId,
    });

    // Unique quizzes attempted by this student
    const attemptedQuizIds = await QuizResult.distinct("quiz", {
      student: req.user._id,
      course: courseId,
    });

    const completedQuizzes = attemptedQuizIds.length;

    let courseProgress = 0;

    if (totalQuizzes > 0) {
      courseProgress = Math.round(
        (completedQuizzes / totalQuizzes) * 100
      );
    }

    // Certificate only when course progress is 100%
    if (courseProgress < 100) {
      return res.status(400).json({
        message: `Certificate not available yet. Complete all quizzes in this course. Current progress: ${courseProgress}%.`,
      });
    }

    const certificate = await Certificate.create({
      student: req.user._id,
      course: courseId,
      certificateId: generateCertificateId(),
    });

    res.status(201).json(certificate);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// const issueCertificate = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     const existing = await Certificate.findOne({ student: req.user._id, course: courseId });
//     if (existing) {
//       return res.status(200).json(existing); // idempotent - just return the one they already have
//     }

   

//     const certificate = await Certificate.create({
//       student: req.user._id,
//       course: courseId,
//       certificateId: generateCertificateId(),
//     });

//     res.status(201).json(certificate);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// @route GET /api/certificates/my
const getMyCertificates = async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate('course', 'title')
    .sort({ issuedAt: -1 });
  res.json(certificates);
};

// @route GET /api/certificates  (admin - all issued certificates)
const getAllCertificates = async (req, res) => {
  const certificates = await Certificate.find()
    .populate('student', 'name email')
    .populate('course', 'title')
    .sort({ issuedAt: -1 });
  res.json(certificates);
};

// @route GET /api/certificates/:id/download
// Streams a generated PDF. Only the certificate's owner or an admin can download it.
const downloadCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate('course', 'title')
    .populate('student', 'name');

  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

  const isOwner = String(certificate.student._id) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to download this certificate' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=certificate-${certificate.certificateId}.pdf`
  );

  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 50 });
  doc.pipe(res);

  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(3)
    .stroke('#2980b9');

  doc
    .fontSize(28)
    .fillColor('#2c3e50')
    .text('Certificate of Completion', { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(14).fillColor('#555').text('This certifies that', { align: 'center' });

  doc.moveDown(0.5);
  doc
    .fontSize(24)
    .fillColor('#2980b9')
    .text(certificate.student.name, { align: 'center' });

  doc.moveDown(0.5);
  doc
    .fontSize(14)
    .fillColor('#555')
    .text('has successfully completed the course', { align: 'center' });

  doc.moveDown(0.5);
  doc
    .fontSize(20)
    .fillColor('#2c3e50')
    .text(certificate.course.title, { align: 'center' });

  doc.moveDown(2);
  doc
    .fontSize(11)
    .fillColor('#888')
    .text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' })
    .text(`Issued: ${new Date(certificate.issuedAt).toLocaleDateString()}`, {
      align: 'center',
    });

  doc.end();
};

module.exports = {
  issueCertificate,
  getMyCertificates,
  getAllCertificates,
  downloadCertificate,
};
