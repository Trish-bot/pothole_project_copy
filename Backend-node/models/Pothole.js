const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    formattedAddress: String
  },
  imageUrl: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  dimensions: {
    width: Number,
    depth: Number
  },
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  detectionMethod: {
    type: String,
    enum: ['camera', 'manual', 'sensor'],
    default: 'camera'
  },
  detectionConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  status: {
    type: String,
    enum: ['detected', 'verified', 'repaired', 'false-positive'],
    default: 'detected'
  },
  roadSegment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadSegment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
potholeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pothole', potholeSchema);
