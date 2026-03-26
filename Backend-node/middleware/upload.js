const multer = require('multer');
const path = require('path');
const fs = require('fs');
const constants = require('../config/constants');

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'pothole-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = constants.UPLOAD.ALLOWED_TYPES;
  const allowedExtensions = constants.UPLOAD.ALLOWED_EXTENSIONS;
  
  const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(constants.MESSAGES.INVALID_FILE_TYPE));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: constants.UPLOAD.MAX_SIZE
  },
  fileFilter: fileFilter
});

// Export different configurations
module.exports = {
  upload,
  // For single image upload
  uploadSingle: upload.single('image'),
  // For multiple images
  uploadMultiple: upload.array('images', 5),
};
