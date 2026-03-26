const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const OTP = require("../models/Otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📩 OTP request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // generate OTP
    const otp = generateOtp();

    console.log("🔑 Generated OTP:", otp);

    // expiry time
    const expireAt = new Date(
      Date.now() + process.env.OTP_EXPIRE_MIN * 60 * 1000
    );

    // save in DB
    await OTP.create({
      email,
      otp,
      expireAt,
    });

    // send email
    await sendEmail(email, otp);

    console.log("✅ OTP sent successfully");

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("❌ Send OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("🔐 Verifying OTP:", otp);

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // check expiry
    if (record.expireAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Create or get user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    // create JWT with user ID
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // delete used OTP
    await OTP.deleteOne({ _id: record._id });

    console.log("✅ OTP verified");

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select('-__v');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
