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

// Get single question (Admin only)
router.get('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('course', 'name code')
      .populate('createdBy', 'firstName lastName');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question'
    });
  }
});

// Update question (Admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const questionId = req.params.id;
    const updates = req.body;

    // Verify course exists if course is being updated
    if (updates.course) {
      const courseExists = await Course.findById(updates.course);
      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      updates,
      { new: true, runValidators: true }
    ).populate('course', 'name code');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question'
    });
  }
});

// Delete question (Admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question'
    });
  }
});

// Toggle question status (Admin only)
router.patch('/:id/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question.isActive = !question.isActive;
    await question.save();

    res.json({
      success: true,
      message: `Question ${question.isActive ? 'activated' : 'deactivated'} successfully`,
      data: question
    });
  } catch (error) {
    console.error('Toggle question status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question status'
    });
  }
});

module.exports = router;
