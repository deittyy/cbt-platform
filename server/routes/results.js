const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Question = require('../models/Question');
const { authenticate, adminOnly } = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// Get student results
router.get('/student', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = { student: req.user._id };
    if (courseId) {
      filter.course = courseId;
    }

    // Get results with pagination
    const results = await TestResult.find(filter)
      .populate('course', 'name code passingScore')
      .populate('student', 'firstName lastName studentId')
      .select('-answers') // Don't include detailed answers in list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TestResult.countDocuments(filter);

    res.json({
      success: true,
      data: results,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      message: results.length > 0 ? 'Results found' : 'No test results available yet'
    });
  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results'
    });
  }
});

// Get detailed result with answers (for review)
router.get('/student/:resultId', authenticate, async (req, res) => {
  try {
    const result = await TestResult.findOne({
      _id: req.params.resultId,
      student: req.user._id
    })
    .populate('course', 'name code passingScore')
    .populate('student', 'firstName lastName studentId')
    .populate({
      path: 'answers.question',
      select: 'questionText options correctAnswer explanation'
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get detailed result error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching detailed result'
    });
  }
});

// Download student results as CSV
router.get('/student/download/csv', authenticate, async (req, res) => {
  try {
    const { courseId } = req.query;
    
    // Build filter
    const filter = { student: req.user._id };
    if (courseId) {
      filter.course = courseId;
    }

    // Get all results for the student
    const results = await TestResult.find(filter)
      .populate('course', 'name code')
      .populate('student', 'firstName lastName studentId')
      .sort({ createdAt: -1 });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found to download'
      });
    }

    // Prepare CSV data
    const csvData = results.map(result => ({
      'Student ID': result.student.studentId,
      'Student Name': `${result.student.firstName} ${result.student.lastName}`,
      'Course': result.course.name,
      'Course Code': result.course.code,
      'Attempt': result.attemptNumber,
      'Total Questions': result.totalQuestions,
      'Correct Answers': result.correctAnswers,
      'Score (%)': result.percentage,
      'Points': `${result.totalPoints}/${result.maxPoints}`,
      'Status': result.passed ? 'PASSED' : 'FAILED',
      'Duration (minutes)': result.duration,
      'Test Date': result.createdAt.toLocaleDateString(),
      'Test Time': result.createdAt.toLocaleTimeString()
    }));

    // Create CSV file
    const fileName = `test-results-${req.user.studentId || req.user._id}-${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'Student ID', title: 'Student ID' },
        { id: 'Student Name', title: 'Student Name' },
        { id: 'Course', title: 'Course' },
        { id: 'Course Code', title: 'Course Code' },
        { id: 'Attempt', title: 'Attempt' },
        { id: 'Total Questions', title: 'Total Questions' },
        { id: 'Correct Answers', title: 'Correct Answers' },
        { id: 'Score (%)', title: 'Score (%)' },
        { id: 'Points', title: 'Points' },
        { id: 'Status', title: 'Status' },
        { id: 'Duration (minutes)', title: 'Duration (minutes)' },
        { id: 'Test Date', title: 'Test Date' },
        { id: 'Test Time', title: 'Test Time' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    // Send file as download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('File cleanup error:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Download CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating CSV file'
    });
  }
});

// Download specific test result as CSV
router.get('/student/:resultId/download/csv', authenticate, async (req, res) => {
  try {
    const result = await TestResult.findOne({
      _id: req.params.resultId,
      student: req.user._id
    })
    .populate('course', 'name code passingScore')
    .populate('student', 'firstName lastName studentId')
    .populate({
      path: 'answers.question',
      select: 'questionText options correctAnswer'
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found'
      });
    }

    // Prepare detailed CSV data
    const csvData = result.answers.map((answer, index) => ({
      'Question No.': index + 1,
      'Question': answer.question.questionText,
      'Your Answer': answer.selectedAnswer,
      'Correct Answer': answer.question.correctAnswer,
      'Status': answer.isCorrect ? 'CORRECT' : 'INCORRECT',
      'Points': `${answer.points}/${answer.question.points || 1}`,
      'Time Spent (seconds)': answer.timeSpent
    }));

    // Add summary row
    csvData.push({
      'Question No.': 'SUMMARY',
      'Question': `Course: ${result.course.name}`,
      'Your Answer': `Total Score: ${result.percentage}%`,
      'Correct Answer': `${result.correctAnswers}/${result.totalQuestions} correct`,
      'Status': result.passed ? 'PASSED' : 'FAILED',
      'Points': `${result.totalPoints}/${result.maxPoints}`,
      'Time Spent (seconds)': `${result.duration} minutes`
    });

    // Create CSV file
    const fileName = `detailed-result-${result.course.code}-${result.attemptNumber}-${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../temp', fileName);
    
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'Question No.', title: 'Question No.' },
        { id: 'Question', title: 'Question' },
        { id: 'Your Answer', title: 'Your Answer' },
        { id: 'Correct Answer', title: 'Correct Answer' },
        { id: 'Status', title: 'Status' },
        { id: 'Points', title: 'Points' },
        { id: 'Time Spent (seconds)', title: 'Time Spent (seconds)' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    // Send file as download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temp file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('File cleanup error:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Download detailed CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating detailed CSV file'
    });
  }
});

// Admin route: Get all results with filters
router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId, studentId, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (courseId) filter.course = courseId;
    if (studentId) filter.student = studentId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get results with pagination
    const results = await TestResult.find(filter)
      .populate('course', 'name code passingScore')
      .populate('student', 'firstName lastName studentId')
      .select('-answers') // Don't include detailed answers in list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TestResult.countDocuments(filter);

    res.json({
      success: true,
      data: results,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin results error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results'
    });
  }
});

module.exports = router;
