const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Course = require('../models/Course');
const { authenticate, adminOnly } = require('../middleware/auth');

// Get all questions (Admin only)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { course, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = course ? { course } : {};
    
    const questions = await Question.find(filter)
      .populate('course', 'name code')
      .populate('createdBy', 'firstName lastName')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions'
    });
  }
});

// Create question (Admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      course,
      difficulty,
      points,
      tags
    } = req.body;

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const question = new Question({
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      course,
      difficulty,
      points,
      tags,
      createdBy: req.user._id
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question'
    });
  }
});

module.exports = router;