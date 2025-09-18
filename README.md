# CBT Platform - Computer-Based Testing System

A comprehensive Computer-Based Testing platform built with React.js frontend and Node.js backend, featuring separate admin and student portals with secure authentication.

## 🌟 Features

### Admin Portal
- **Secure Admin Login** with special Admin ID system
- **Course Management** - Create, edit, and organize courses
- **Question Management** - Add, edit, and categorize questions
- **Student Results** - View comprehensive test results and analytics
- **Dashboard** - Overview of platform statistics
- **No Auto-Login** - Manual authentication required each time

### Student Portal
- **Student Registration** with course selection
- **Secure Student Login** with email/password
- **Course-Based Testing** - Access tests based on enrolled course
- **Real-time Results** - View scores and correct answers after test completion
- **Progress Tracking** - Monitor academic performance
- **Persistent Login** - Seamless experience with saved authentication

### Core Features
- **Separate Portals** - Independent admin and student interfaces
- **Database Integration** - MongoDB for persistent data storage
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Secure Authentication** - JWT-based authentication system
- **Course Categorization** - Questions organized by subject/course
- **Results Export** - Spreadsheet export capability for student data
- **Real-time Scoring** - Instant test results and feedback

## 🚀 Technology Stack

### Frontend
- **React.js 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - Responsive UI framework
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client for API communication
- **React Icons** - Icon library

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for version control)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cbt-platform
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Configuration
Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cbt-platform
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
SUPER_ADMIN_ID=ADMIN001
SUPER_ADMIN_EMAIL=admin@cbtplatform.com
SUPER_ADMIN_PASSWORD=AdminPassword123!
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod
```

### 6. Run the Application

**Start Backend Server:**
```bash
cd server
npm run dev
# or
npm start
```

**Start Frontend Client (in a new terminal):**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📱 Usage

### Initial Setup

1. **Access the Home Page:** Navigate to http://localhost:3000
2. **Choose Portal:** Select either Admin or Student portal

### Admin Access

1. **Login:** Use Admin ID and password
   - Default Admin ID: `ADMIN001`
   - Default Password: `AdminPassword123!`

2. **Manage Courses:** Create and organize course offerings
3. **Add Questions:** Create test questions with multiple choice answers
4. **View Results:** Monitor student performance and export data

### Student Access

1. **Register:** Create a new account with course selection
2. **Login:** Use email and password to access dashboard
3. **Take Tests:** Access course-specific tests (when available)
4. **View Results:** Check scores and review correct answers

## 🗂️ Project Structure

```
cbt-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/      # Admin portal components
│   │   │   ├── student/    # Student portal components
│   │   │   └── shared/     # Shared components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for passwords
- **Role-Based Access** - Separate admin and student permissions
- **Input Validation** - Server-side data validation
- **CORS Protection** - Configured for secure cross-origin requests

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Bootstrap Theme** - Professional and modern interface
- **Separate Branding** - Distinct admin (green) and student (blue) themes
- **Loading States** - User feedback during operations
- **Error Handling** - Comprehensive error messages
- **Accessibility** - Screen reader friendly components

## 🚀 Deployment

### Vercel (Frontend)
1. Build the client: `cd client && npm run build`
2. Deploy to Vercel from the client directory
3. Set environment variables in Vercel dashboard

### Render (Backend)
1. Create a Render account
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy as a Web Service

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_vercel_app_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Test functionality is currently in development
- Spreadsheet export feature is planned for future release
- Email notifications not yet implemented

## 🔄 Future Enhancements

- Complete test-taking functionality
- Advanced analytics and reporting
- Email notification system
- Question import/export
- Multi-language support
- Advanced question types (essay, file upload)

## 📞 Support

For support and questions, please open an issue on the GitHub repository.

---

**Built with ❤️ for educational institutions and online learning platforms.**