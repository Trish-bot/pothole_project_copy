// Application Constants
module.exports = {
  // Pothole Severity Levels
  SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },

  // Pothole Status
  STATUS: {
    DETECTED: 'detected',
    VERIFIED: 'verified',
    IN_PROGRESS: 'in-progress',
    REPAIRED: 'repaired',
    FALSE_POSITIVE: 'false-positive',
  },

  // Detection Methods
  DETECTION_METHOD: {
    AI_VISION: 'ai-vision',
    SENSOR: 'sensor',
    MANUAL: 'manual',
    CROWDSOURCED: 'crowdsourced',
    CAMERA: 'camera',
  },

  // Road Condition Colors
  ROAD_CONDITION: {
    GREEN: {
      color: 'green',
      minScore: 80,
      maxScore: 100,
      label: 'Good',
    },
    YELLOW: {
      color: 'yellow',
      minScore: 60,
      maxScore: 79,
      label: 'Fair',
    },
    ORANGE: {
      color: 'orange',
      minScore: 40,
      maxScore: 59,
      label: 'Poor',
    },
    RED: {
      color: 'red',
      minScore: 0,
      maxScore: 39,
      label: 'Critical',
    },
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MAINTENANCE: 'maintenance',
  },

  // Traffic Volume
  TRAFFIC_VOLUME: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },

  // Road Types
  ROAD_TYPES: {
    HIGHWAY: 'highway',
    ARTERIAL: 'arterial',
    COLLECTOR: 'collector',
    LOCAL: 'local',
  },

  // Detection Confidence Thresholds
  CONFIDENCE: {
    MIN_ACCEPTABLE: 60,
    HIGH_CONFIDENCE: 85,
    VERY_HIGH_CONFIDENCE: 95,
  },

  // Geo-Spatial Constants
  GEO: {
    EARTH_RADIUS_METERS: 6371000,
    DEFAULT_RADIUS_METERS: 500,
    MAX_RADIUS_METERS: 5000,
    MIN_DISTANCE_METERS: 10,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // File Upload
  UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
  },

  // Session Status
  SESSION_STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    ABORTED: 'aborted',
    IN_PROGRESS: 'in-progress',
  },

  // Severity Scores for Weighted Calculations
  SEVERITY_WEIGHTS: {
    low: 1,
    medium: 2,
    high: 3,
    critical: 5,
  },

  // API Response Messages
  MESSAGES: {
    // Success
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    POTHOLEDETECTED: 'Pothole detected successfully',
    SESSION_STARTED: 'Detection session started',
    SESSION_ENDED: 'Detection session ended',
    DATA_FETCHED: 'Data fetched successfully',
    DATA_UPDATED: 'Data updated successfully',
    DATA_DELETED: 'Data deleted successfully',
    
    // Error
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    INVALID_OTP: 'Invalid OTP',
    OTP_EXPIRED: 'OTP has expired',
    INVALID_TOKEN: 'Invalid or expired token',
    INVALID_CREDENTIALS: 'Invalid credentials',
    VALIDATION_ERROR: 'Validation error',
    DUPLICATE_ENTRY: 'Duplicate entry found',
    FILE_TOO_LARGE: 'File size exceeds limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    GEOLOCATION_ERROR: 'Unable to get location',
    CAMERA_ERROR: 'Unable to access camera',
    
    // Info
    SESSION_ACTIVE: 'Session is active',
    SESSION_INACTIVE: 'Session is inactive',
    NO_DATA: 'No data available',
    PENDING_VERIFICATION: 'Pending verification',
  },

  // Cache Keys
  CACHE_KEYS: {
    ROAD_HEATMAP: 'road_heatmap',
    POTHOLES_NEARBY: 'potholes_nearby',
    ROAD_STATS: 'road_stats',
    USER_PROFILE: 'user_profile',
  },

  // Cache TTL (Time to Live in seconds)
  CACHE_TTL: {
    ROAD_HEATMAP: 300, // 5 minutes
    POTHOLES_NEARBY: 60, // 1 minute
    ROAD_STATS: 600, // 10 minutes
    USER_PROFILE: 1800, // 30 minutes
  },

  // Socket Events
  SOCKET_EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    JOIN_SESSION: 'join-session',
    LEAVE_SESSION: 'leave-session',
    POTHOLEDETECTED: 'pothole-detected',
    POTHOLEDETECTED: 'pothole-alert',
    SESSION_STARTED: 'session-started',
    SESSION_ENDED: 'session-ended',
    LOCATION_UPDATE: 'location-update',
  },

  // Map Configuration
  MAP: {
    DEFAULT_CENTER: {
      lat: 12.9716,
      lng: 77.5946,
    },
    DEFAULT_ZOOM: 14,
    MIN_ZOOM: 8,
    MAX_ZOOM: 20,
    HEATMAP_RADIUS: 30,
    HEATMAP_OPACITY: 0.6,
  },

  // Alert Types
  ALERT_TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  },

  // Audio Beep Configuration
  AUDIO: {
    BEEP_FREQUENCY: {
      LOW: 600,
      MEDIUM: 800,
      HIGH: 1000,
      CRITICAL: 1200,
    },
    BEEP_DURATION: {
      SHORT: 150,
      MEDIUM: 200,
      LONG: 300,
    },
    BEEP_COUNT: {
      LOW: 1,
      MEDIUM: 1,
      HIGH: 2,
      CRITICAL: 3,
    },
  },

  // Validation Rules
  VALIDATION: {
    NAME: {
      MIN: 2,
      MAX: 50,
    },
    EMAIL: {
      PATTERN: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    PHONE: {
      PATTERN: /^[0-9]{10}$/,
    },
    PASSWORD: {
      MIN: 6,
      MAX: 100,
    },
    OTP: {
      LENGTH: 6,
      PATTERN: /^[0-9]{6}$/,
    },
    LOCATION: {
      LAT_MIN: -90,
      LAT_MAX: 90,
      LNG_MIN: -180,
      LNG_MAX: 180,
    },
  },

  // Date Formats
  DATE_FORMATS: {
    DEFAULT: 'YYYY-MM-DD',
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm:ss',
    API: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    TIME: 'HH:mm:ss',
  },

  // Sort Options
  SORT_OPTIONS: {
    NEWEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
    SEVERITY_HIGH: { severity: -1 },
    SEVERITY_LOW: { severity: 1 },
    CONFIDENCE_HIGH: { detectionConfidence: -1 },
    CONFIDENCE_LOW: { detectionConfidence: 1 },
    ROAD_CONDITION_GOOD: { conditionScore: -1 },
    ROAD_CONDITION_POOR: { conditionScore: 1 },
  },

  // Filter Options
  FILTERS: {
    SEVERITY: ['low', 'medium', 'high', 'critical'],
    STATUS: ['detected', 'verified', 'in-progress', 'repaired', 'false-positive'],
    ROAD_CONDITION: ['green', 'yellow', 'orange', 'red'],
    DETECTION_METHOD: ['ai-vision', 'sensor', 'manual', 'crowdsourced', 'camera'],
    USER_ROLE: ['user', 'admin', 'maintenance'],
  },

  // API Endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    POTHOLES: '/api/potholes',
    ROADS: '/api/roads',
    DETECTION: '/api/detection',
    ANALYTICS: '/api/analytics',
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    OTP_MAX_REQUESTS: 5,
    DETECTION_MAX_REQUESTS: 60, // Per minute
  },

  // Environment
  ENV: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  },
};
