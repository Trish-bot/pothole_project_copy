const mongoose = require('mongoose');

const roadSegmentSchema = new mongoose.Schema({
  roadName: String,
  geometry: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: [[Number]]
  },
  length: Number,
  city: String,
  potholeStats: {
    totalCount: { type: Number, default: 0 },
    lowCount: { type: Number, default: 0 },
    mediumCount: { type: Number, default: 0 },
    highCount: { type: Number, default: 0 },
    criticalCount: { type: Number, default: 0 }
  },
  conditionScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  conditionColor: {
    type: String,
    enum: ['green', 'yellow', 'orange', 'red'],
    default: 'green'
  },
  potholeDensity: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roadSegmentSchema.index({ geometry: '2dsphere' });

// Method to update condition based on pothole count
roadSegmentSchema.methods.updateCondition = function() {
  const { totalCount, criticalCount, highCount } = this.potholeStats;
  
  if (totalCount === 0) {
    this.conditionScore = 100;
    this.conditionColor = 'green';
    this.potholeDensity = 0;
  } else {
    // Calculate density (potholes per km)
    this.potholeDensity = (totalCount / this.length) * 1000;
    
    // Calculate score
    const severityScore = (criticalCount * 10) + (highCount * 5);
    this.conditionScore = Math.max(0, 100 - (severityScore * 2));
    
    // Set color
    if (this.conditionScore >= 80) this.conditionColor = 'green';
    else if (this.conditionScore >= 60) this.conditionColor = 'yellow';
    else if (this.conditionScore >= 40) this.conditionColor = 'orange';
    else this.conditionColor = 'red';
  }
  
  this.updatedAt = new Date();
  return this;
};

module.exports = mongoose.model('RoadSegment', roadSegmentSchema);
