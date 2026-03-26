const RoadSegment = require('../models/RoadSegment');
const Pothole = require('../models/Pothole');

// Get heatmap data (color-coded roads)
exports.getHeatmapData = async (req, res) => {
  try {
    const { city, bounds } = req.query;
    
    const query = {};
    if (city) query.city = city;
    
    const roads = await RoadSegment.find(query);
    
    // Format for map visualization
    const heatmapData = roads.map(road => ({
      id: road._id,
      roadName: road.roadName,
      geometry: road.geometry,
      condition: {
        score: road.conditionScore,
        color: road.conditionColor,
        density: road.potholeDensity
      },
      stats: road.potholeStats,
      // GeoJSON format for map
      geojson: {
        type: 'Feature',
        geometry: road.geometry,
        properties: {
          roadName: road.roadName,
          conditionScore: road.conditionScore,
          conditionColor: road.conditionColor,
          potholeCount: road.potholeStats.totalCount
        }
      }
    }));
    
    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all road segments
exports.getRoadSegments = async (req, res) => {
  try {
    const roads = await RoadSegment.find().sort({ conditionScore: 1 });
    res.json({ success: true, data: roads });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get road statistics for dashboard
exports.getRoadStats = async (req, res) => {
  try {
    const [
      totalRoads,
      greenRoads,
      yellowRoads,
      orangeRoads,
      redRoads,
      avgCondition
    ] = await Promise.all([
      RoadSegment.countDocuments(),
      RoadSegment.countDocuments({ conditionColor: 'green' }),
      RoadSegment.countDocuments({ conditionColor: 'yellow' }),
      RoadSegment.countDocuments({ conditionColor: 'orange' }),
      RoadSegment.countDocuments({ conditionColor: 'red' }),
      RoadSegment.aggregate([
        { $group: { _id: null, avg: { $avg: '$conditionScore' } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        totalRoads,
        conditionBreakdown: {
          green: greenRoads,
          yellow: yellowRoads,
          orange: orangeRoads,
          red: redRoads
        },
        averageCondition: avgCondition[0]?.avg || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
