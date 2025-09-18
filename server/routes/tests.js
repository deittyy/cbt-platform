const express = require('express');
const router = express.Router();
const { authenticate, studentOnly } = require('../middleware/auth');

// Get available tests for student
router.get('/available', authenticate, studentOnly, async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'No tests available yet'
    });
  } catch (error) {
    console.error('Get available tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available tests'
    });
  }
});

module.exports = router;