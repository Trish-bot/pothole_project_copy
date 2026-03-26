const Pothole = require('../models/Pothole');

// Get potholes with filters
exports.getPotholes = async (req, res) => {
  try {
    const { severity, status, limit = 100 } = req.query;
    const query = {};
    
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    const potholes = await Pothole.find(query)
      .populate('detectedBy', 'email name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: potholes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get potholes near a location
exports.getNearbyPotholes = async (req, res) => {
  try {
    const { lat, lng, radius = 500 } = req.query;
    
    const potholes = await Pothole.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      status: { $ne: 'repaired' }
    }).limit(50);
    
    res.json({ success: true, data: potholes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify a pothole
exports.verifyPothole = async (req, res) => {
  try {
    const { id } = req.params;
    const pothole = await Pothole.findByIdAndUpdate(
      id,
      { status: 'verified' },
      { new: true }
    );
    
    res.json({ success: true, data: pothole });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
