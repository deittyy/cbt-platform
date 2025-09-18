const mongoose = require('mongoose');
require('dotenv').config();

const testServerSetup = async () => {
  console.log('🧪 Testing CBT Platform Server Setup...\n');
  
  try {
    // Test 1: Environment Variables
    console.log('✅ Environment Variables:');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('   PORT:', process.env.PORT || '5000');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('');

    // Test 2: MongoDB Connection
    console.log('🔌 Testing MongoDB Connection...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbt-platform';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    console.log('');

    // Test 3: Models
    console.log('📦 Testing Models...');
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Question = require('./models/Question');
    const TestResult = require('./models/TestResult');
    console.log('✅ All models loaded successfully!');
    console.log('');

    // Test 4: Sample Data Check
    console.log('📊 Checking Sample Data...');
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const questionCount = await Question.countDocuments();
    const resultCount = await TestResult.countDocuments();
    
    console.log('   Users:', userCount);
    console.log('   Courses:', courseCount);
    console.log('   Questions:', questionCount);
    console.log('   Test Results:', resultCount);
    console.log('');

    console.log('🎉 Server setup test completed successfully!');
    console.log('');
    console.log('🚀 Ready to start your CBT Platform!');
    console.log('   Run: npm start (or press F5 in VS Code)');
    console.log('   Server will be available at: http://localhost:' + (process.env.PORT || 5000));
    
  } catch (error) {
    console.error('❌ Setup test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testServerSetup();