const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Changed from authMiddleware to auth

const {
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile
} = require("../controllers/authController"); // Updated controller name

// OTP Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Protected Routes (require authentication)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
