const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/overview', protect, adminOnly, getOverview);

module.exports = router;
