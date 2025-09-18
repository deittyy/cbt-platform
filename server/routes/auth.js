const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Student Registration
router.post('/register/student', async (req, res) => {
  try {
    const { firstName, lastName, email, password, course, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create student
    const student = new User({
      firstName,
      lastName,
      email,
      password,
      course,
      phone,
      address,
      role: 'student'
    });

    await student.save();

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        token,
        user: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          studentId: student.studentId,
          course: student.course,
          role: student.role
        }
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Admin Registration (Protected - only existing admins can create new admins)
router.post('/register/admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password, adminId } = req.body;

    // Check if admin ID is provided
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if admin ID already exists
    const existingAdmin = await User.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID already exists'
      });
    }

    // Create admin
    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      adminId,
      role: 'admin'
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          adminId: admin.adminId,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Student Login
router.post('/login/student', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student
    const student = await User.findOne({ 
      email, 
      role: 'student',
      isActive: true 
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account not found'
      });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          studentId: student.studentId,
          course: student.course,
          role: student.role
        }
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Admin Login
router.post('/login/admin', async (req, res) => {
  try {
    const { adminId, password } = req.body;

    // Find admin by adminId
    const admin = await User.findOne({ 
      adminId, 
      role: 'admin',
      isActive: true 
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          adminId: admin.adminId,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get Current User
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Logout (Client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;