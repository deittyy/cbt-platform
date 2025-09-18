const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Question = require('../models/Question');
const { authenticate, adminOnly } = require('../middleware/auth');

// Get all active courses (public for student registration)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select('name code description duration totalQuestions passingScore instructions')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .select('-__v');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
  }
});

// Create course (Admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      duration,
      totalQuestions,
      passingScore,
      instructions
    } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course code already exists'
      });
    }

    const course = new Course({
      name,
      code: code.toUpperCase(),
      description,
      duration,
      totalQuestions,
      passingScore,
      instructions,
      createdBy: req.user._id
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course'
    });
  }
});

// Update course (Admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    // If updating code, check for duplicates
    if (updates.code) {
      const existingCourse = await Course.findOne({
        code: updates.code.toUpperCase(),
        _id: { $ne: courseId }
      });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course code already exists'
        });
      }
      updates.code = updates.code.toUpperCase();
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course'
    });
  }
});

// Delete course (Admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if course has questions
    const questionCount = await Question.countDocuments({ course: courseId });
    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with existing questions. Delete questions first.'
      });
    }

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course'
    });
  }
});

// Toggle course status (Admin only)
router.patch('/:id/toggle-status', authenticate, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.isActive = !course.isActive;
    await course.save();

    res.json({
      success: true,
      message: `Course ${course.isActive ? 'activated' : 'deactivated'} successfully`,
      data: course
    });
  } catch (error) {
    console.error('Toggle course status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course status'
    });
  }
});

module.exports = router;