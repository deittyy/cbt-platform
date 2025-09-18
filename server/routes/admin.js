const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middleware/auth');

// Get admin dashboard stats
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalCourses: 0,
        totalQuestions: 0,
        activeStudents: 0,
        testsTaken: 0
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics'
    });
  }
});

module.exports = router;