const mongoose = require('mongoose');

const detectionSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: [[Number]]
  },
  potholesDetected: [{
    location: [Number],
    severity: String,
    confidence: Number,
    timestamp: Date,
    imageUrl: String
  }],
  stats: {
    totalPotholes: { type: Number, default: 0 },
    lowSeverity: { type: Number, default: 0 },
    mediumSeverity: { type: Number, default: 0 },
    highSeverity: { type: Number, default: 0 },
    criticalSeverity: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'aborted'],
    default: 'active'
  }
});

module.exports = mongoose.model('DetectionSession', detectionSessionSchema);
