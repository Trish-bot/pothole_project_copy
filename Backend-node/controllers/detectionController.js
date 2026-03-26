const Pothole = require('../models/Pothole');
const RoadSegment = require('../models/RoadSegment');
const DetectionSession = require('../models/DetectionSession');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const constants = require('../config/constants');

// Start a new detection session
exports.startSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = await DetectionSession.create({
      sessionId,
      userId: req.user.id,
      startTime: new Date(),
      status: constants.SESSION_STATUS.ACTIVE
    });
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      message: constants.MESSAGES.SESSION_STARTED
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: constants.MESSAGES.SERVER_ERROR });
  }
};

// End detection session
exports.endSession = async (req, res) => {
  try {
    const { sessionId, route } = req.body;
    
    const session = await DetectionSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: constants.MESSAGES.NOT_FOUND });
    }
    
    session.endTime = new Date();
    session.status = constants.SESSION_STATUS.COMPLETED;
    if (route) {
      session.route = {
        type: 'LineString',
        coordinates: route
      };
    }
    
    await session.save();
    
    res.json({
      success: true,
      message: constants.MESSAGES.SESSION_ENDED,
      stats: session.stats
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ message: constants.MESSAGES.SERVER_ERROR });
  }
};

// Process a detected pothole from camera
exports.detectPothole = async (req, res) => {
  try {
    const { 
      sessionId, 
      location,  // [longitude, latitude]
      severity,
      confidence
    } = req.body;
    
    let imageUrl = null;
    
    // Save image if uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Find or create road segment
    let roadSegment = await findRoadSegment(location);
    
    // Validate severity
    const validSeverity = Object.values(constants.SEVERITY).includes(severity) 
      ? severity 
      : constants.SEVERITY.MEDIUM;
    
    // Create pothole record
    const pothole = await Pothole.create({
      location: {
        type: 'Point',
        coordinates: location
      },
      imageUrl,
      severity: validSeverity,
      detectionConfidence: confidence || 85,
      detectionMethod: constants.DETECTION_METHOD.CAMERA,
      detectedBy: req.user.id,
      roadSegment: roadSegment?._id,
      status: constants.STATUS.DETECTED
    });
    
    // Update detection session
    if (sessionId) {
      const session = await DetectionSession.findOne({ sessionId });
      if (session && session.status === constants.SESSION_STATUS.ACTIVE) {
        session.potholesDetected.push({
          location,
          severity: validSeverity,
          confidence: confidence || 85,
          timestamp: new Date(),
          imageUrl
        });
        
        // Update stats
        session.stats.totalPotholes++;
        session.stats[`${validSeverity}Severity`]++;
        await session.save();
      }
    }
    
    // Update road segment stats
    if (roadSegment) {
      await updateRoadSegmentStats(roadSegment._id);
    }
    
    // Get the io instance for real-time alert
    const io = req.app.get('io');
    if (io && sessionId) {
      io.to(`session-${sessionId}`).emit(constants.SOCKET_EVENTS.POTHOLEDETECTED, {
        location,
        severity: validSeverity,
        confidence: confidence || 85,
        timestamp: new Date(),
        potholeId: pothole._id
      });
    }
    
    res.json({
      success: true,
      message: constants.MESSAGES.POTHOLEDETECTED,
      pothole: {
        id: pothole._id,
        location,
        severity: validSeverity,
        imageUrl
      }
    });
    
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ message: constants.MESSAGES.SERVER_ERROR });
  }
};

// Helper: Find road segment containing point
async function findRoadSegment(point) {
  const segments = await RoadSegment.find({
    geometry: {
      $near: {
        $geometry: { type: 'Point', coordinates: point },
        $maxDistance: constants.GEO.DEFAULT_RADIUS_METERS
      }
    }
  }).limit(1);
  
  return segments[0] || null;
}

// Helper: Update road segment statistics
async function updateRoadSegmentStats(segmentId) {
  const segment = await RoadSegment.findById(segmentId);
  if (!segment) return;
  
  const potholes = await Pothole.find({ 
    roadSegment: segmentId,
    status: { $ne: constants.STATUS.REPAIRED }
  });
  
  segment.potholeStats = {
    totalCount: potholes.length,
    lowCount: potholes.filter(p => p.severity === constants.SEVERITY.LOW).length,
    mediumCount: potholes.filter(p => p.severity === constants.SEVERITY.MEDIUM).length,
    highCount: potholes.filter(p => p.severity === constants.SEVERITY.HIGH).length,
    criticalCount: potholes.filter(p => p.severity === constants.SEVERITY.CRITICAL).length
  };
  
  segment.updateCondition();
  await segment.save();
}
