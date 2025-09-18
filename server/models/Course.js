const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
    default: 60
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 20
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70
  },
  isActive: {
    type: Boolean,
    default: true
  },
  instructions: {
    type: String,
    default: "Please read each question carefully and select the best answer."
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);