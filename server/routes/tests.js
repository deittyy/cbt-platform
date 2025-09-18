const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const { authenticate, studentOnly } = require('../middleware/auth');

// Get available tests for student
router.get('/available', authenticate, studentOnly, async (req, res) => {
  try {
    // Get courses that have questions
    const coursesWithQuestions = await Course.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'course',
          as: 'questions'
        }
      },
      {
        $match: {
          isActive: true,
          'questions.0': { $exists: true } // Only courses with questions
        }
      },
      {
        $project: {
          name: 1,
          code: 1,
          description: 1,
          duration: 1,
          totalQuestions: 1,
          passingScore: 1,
          instructions: 1,
          questionCount: { $size: '$questions' }
        }
      }
    ]);

    res.json({
      success: true,
      data: coursesWithQuestions,
      message: coursesWithQuestions.length > 0 ? 'Available tests found' : 'No tests available yet'
    });
  } catch (error) {
    console.error('Get available tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available tests'
    });
  }
});

// Start a test (get questions for a course)
router.get('/start/:courseId', authenticate, studentOnly, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      });
    }

    // Get questions for the course (without correct answers for students)
    const questions = await Question.find({ 
      course: courseId, 
      isActive: true 
    })
    .select('-correctAnswer -createdBy -__v') // Hide correct answers from students
    .populate('course', 'name code duration passingScore')
    .sort({ createdAt: 1 })
    .limit(course.totalQuestions || 20);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions available for this course'
      });
    }

    res.json({
      success: true,
      data: {
        course: {
          _id: course._id,
          name: course.name,
          code: course.code,
          duration: course.duration,
          totalQuestions: course.totalQuestions,
          passingScore: course.passingScore,
          instructions: course.instructions
        },
        questions: questions,
        totalQuestions: questions.length,
        startTime: new Date()
      }
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting test'
    });
  }
});

// Submit test answers
router.post('/submit/:courseId', authenticate, studentOnly, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers, startTime, endTime } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get all questions for the course to calculate scores
    const questions = await Question.find({ 
      course: courseId, 
      isActive: true 
    });

    // Calculate scores
    let totalPoints = 0;
    let maxPoints = 0;
    let correctAnswers = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const points = isCorrect ? question.points : 0;
        
        processedAnswers.push({
          question: question._id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: isCorrect,
          points: points,
          timeSpent: answer.timeSpent || 0
        });

        totalPoints += points;
        maxPoints += question.points;
        if (isCorrect) correctAnswers++;
      }
    }

    // Calculate test duration
    const testStartTime = new Date(startTime);
    const testEndTime = new Date(endTime || Date.now());
    const duration = Math.floor((testEndTime - testStartTime) / 1000 / 60); // in minutes

    // Check for existing test result to determine attempt number
    const existingResults = await TestResult.find({
      student: req.user._id,
      course: courseId
    }).sort({ attemptNumber: -1 });
    
    const attemptNumber = existingResults.length > 0 ? existingResults[0].attemptNumber + 1 : 1;

    // Create test result
    const testResult = new TestResult({
      student: req.user._id,
      course: courseId,
      answers: processedAnswers,
      totalQuestions: questions.length,
      correctAnswers: correctAnswers,
      totalPoints: totalPoints,
      maxPoints: maxPoints,
      startTime: testStartTime,
      endTime: testEndTime,
      duration: duration,
      attemptNumber: attemptNumber,
      passingScore: course.passingScore
    });

    await testResult.save();

    // Populate the saved result for response
    await testResult.populate('course', 'name code passingScore');

    res.json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        _id: testResult._id,
        course: testResult.course,
        totalQuestions: testResult.totalQuestions,
        correctAnswers: testResult.correctAnswers,
        totalPoints: testResult.totalPoints,
        maxPoints: testResult.maxPoints,
        percentage: testResult.percentage,
        passed: testResult.passed,
        duration: testResult.duration,
        attemptNumber: testResult.attemptNumber,
        submittedAt: testResult.createdAt
      }
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting test'
    });
  }
});

module.exports = router;
