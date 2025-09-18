const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cbt-platform';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional - remove in production)
    // await User.deleteMany({});
    // await Course.deleteMany({});
    // console.log('Cleared existing data...');

    // Create default admin user
    const adminExists = await User.findOne({ adminId: 'ADMIN001' });
    if (!adminExists) {
      const adminUser = new User({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@cbtplatform.com',
        password: 'AdminPassword123!',
        role: 'admin',
        adminId: 'ADMIN001'
      });

      await adminUser.save();
      console.log('✅ Default admin user created:');
      console.log('   Admin ID: ADMIN001');
      console.log('   Password: AdminPassword123!');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample courses
    const sampleCourses = [
      {
        name: 'Computer Science Fundamentals',
        code: 'CS101',
        description: 'Introduction to computer science concepts and programming',
        duration: 90,
        totalQuestions: 25,
        passingScore: 70,
        instructions: 'Please read each question carefully and select the best answer. You have 90 minutes to complete this test.',
        createdBy: adminExists ? adminExists._id : (await User.findOne({ adminId: 'ADMIN001' }))._id
      },
      {
        name: 'Web Development',
        code: 'WEB101',
        description: 'HTML, CSS, JavaScript fundamentals',
        duration: 60,
        totalQuestions: 20,
        passingScore: 75,
        instructions: 'This test covers basic web development concepts. Answer all questions to the best of your ability.',
        createdBy: adminExists ? adminExists._id : (await User.findOne({ adminId: 'ADMIN001' }))._id
      },
      {
        name: 'Database Management',
        code: 'DB101',
        description: 'Database design and SQL fundamentals',
        duration: 75,
        totalQuestions: 30,
        passingScore: 70,
        instructions: 'This test evaluates your understanding of database concepts and SQL queries.',
        createdBy: adminExists ? adminExists._id : (await User.findOne({ adminId: 'ADMIN001' }))._id
      }
    ];

    for (const courseData of sampleCourses) {
      const courseExists = await Course.findOne({ code: courseData.code });
      if (!courseExists) {
        const course = new Course(courseData);
        await course.save();
        console.log(`✅ Created sample course: ${courseData.name} (${courseData.code})`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Start the client: cd ../client && npm start');
    console.log('3. Visit: http://localhost:3000');
    console.log('4. Login with Admin ID: ADMIN001 and password: AdminPassword123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
seedDatabase();