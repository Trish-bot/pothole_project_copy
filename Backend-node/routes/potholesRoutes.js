const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const potholeController = require('../controllers/potholeController');

// Public routes
router.get('/', potholeController.getPotholes);
router.get('/nearby', potholeController.getNearbyPotholes);
router.get('/:id', potholeController.getPotholeById);

// Protected routes
router.put('/:id/verify', auth, potholeController.verifyPothole);
router.put('/:id/status', auth, potholeController.updateStatus);

module.exports = router;
