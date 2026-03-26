const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roadController = require('../controllers/roadController');

// Public routes (no authentication required)
router.get('/heatmap', roadController.getHeatmapData);
router.get('/', roadController.getRoadSegments);
router.get('/stats', roadController.getRoadStats);

// Protected routes (admin only)
router.post('/', auth, roadController.createRoadSegment);
router.put('/:id/condition', auth, roadController.updateRoadCondition);

module.exports = router;
