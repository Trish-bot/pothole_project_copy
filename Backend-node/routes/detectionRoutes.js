const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const detectionController = require('../controllers/detectionController');

// All detection routes require authentication
router.use(auth);

// Session management
router.post('/start', detectionController.startSession);
router.post('/end', detectionController.endSession);

// Detection with optional image upload
router.post('/detect', uploadSingle, detectionController.detectPothole);

module.exports = router;
