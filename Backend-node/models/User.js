const mongoose = require('mongoose');
const constants = require('../config/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: Object.values(constants.USER_ROLES),
    default: constants.USER_ROLES.USER
  },
  potholeContributions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Find or create user by email
userSchema.statics.findOrCreate = async function(email) {
  let user = await this.findOne({ email });
  if (!user) {
    user = await this.create({ email });
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
