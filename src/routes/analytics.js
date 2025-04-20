const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getTaskStats, getTaskTrends } = require('../controllers/analyticsController');

// Apply authentication middleware to all analytics routes
router.use(authenticate);

// Analytics routes
router.get('/stats', getTaskStats);
router.get('/trends', getTaskTrends);

module.exports = router;