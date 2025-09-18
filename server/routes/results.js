const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get student results
router.get('/student', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'No test results available yet'
    });
  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results'
    });
  }
});

module.exports = router;