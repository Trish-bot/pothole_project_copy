const Pothole = require('../models/Pothole');
const RoadSegment = require('../models/RoadSegment');
const DetectionSession = require('../models/DetectionSession');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Start a new detection session
exports.startSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = await DetectionSession.create({
      sessionId,
      userId: req.user.id,
      startTime: new Date(),
      status: 'active'
    });
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      message: 'Detection session started'
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// End detection session
exports.endSession = async (req, res) => {
  try {
    const { sessionId, route } = req.body;
    
    const session = await DetectionSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.endTime = new Date();
    session.status = 'completed';
    if (route) {
      session.route = {
        type: 'LineString',
        coordinates: route
      };
    }
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Session completed',
      stats: session.stats
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process a detected pothole from camera
exports.detectPothole = async (req, res) => {
  try {
    const { 
      sessionId, 
      location,  // [longitude, latitude]
      severity,
      confidence,
      imageBase64  // Base64 image from camera
    } = req.body;
    
    // Save image if provided
    let imageUrl = null;
    if (imageBase64) {
      const imageName = `pothole_${Date.now()}.jpg`;
      const imagePath = path.join(__dirname, '../uploads', imageName);
      
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(imagePath, base64Data, 'base64');
      imageUrl = `/uploads/${imageName}`;
    }
    
    // Find or create road segment
    let roadSegment = await findRoadSegment(location);
    
    // Create pothole record
    const pothole = await Pothole.create({
      location: {
        type: 'Point',
        coordinates: location
      },
      imageUrl,
      severity: severity || 'medium',
      detectionConfidence: confidence || 85,
      detectionMethod: 'camera',
      detectedBy: req.user.id,
      roadSegment: roadSegment?._id,
      status: 'detected'
    });
    
    // Update detection session
    if (sessionId) {
      const session = await DetectionSession.findOne({ sessionId });
      if (session && session.status === 'active') {
        session.potholesDetected.push({
          location,
          severity: severity || 'medium',
          confidence: confidence || 85,
          timestamp: new Date(),
          imageUrl
        });
        
        // Update stats
        session.stats.totalPotholes++;
        session.stats[`${severity || 'medium'}Severity`]++;
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
      io.to(`session-${sessionId}`).emit('pothole-alert', {
        location,
        severity: severity || 'medium',
        confidence: confidence || 85,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      pothole: {
        id: pothole._id,
        location,
        severity: severity || 'medium',
        imageUrl
      }
    });
    
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: Find road segment containing point
async function findRoadSegment(point) {
  const segments = await RoadSegment.find({
    geometry: {
      $near: {
        $geometry: { type: 'Point', coordinates: point },
        $maxDistance: 50
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
    status: { $ne: 'repaired' }
  });
  
  segment.potholeStats = {
    totalCount: potholes.length,
    lowCount: potholes.filter(p => p.severity === 'low').length,
    mediumCount: potholes.filter(p => p.severity === 'medium').length,
    highCount: potholes.filter(p => p.severity === 'high').length,
    criticalCount: potholes.filter(p => p.severity === 'critical').length
  };
  
  segment.updateCondition();
  await segment.save();
}
