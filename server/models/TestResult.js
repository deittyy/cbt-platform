const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  },
  maxPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['completed', 'incomplete', 'timeout'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Index for better query performance
testResultSchema.index({ student: 1, course: 1, createdAt: -1 });

// Calculate percentage and pass status before saving
testResultSchema.pre('save', function(next) {
  this.percentage = Math.round((this.totalPoints / this.maxPoints) * 100);
  
  // Get passing score from course (you'll need to populate or pass it)
  // For now, default to 70%
  const passingScore = this.passingScore || 70;
  this.passed = this.percentage >= passingScore;
  
  next();
});

module.exports = mongoose.model('TestResult', testResultSchema);