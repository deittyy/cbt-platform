import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import HomePage from './components/shared/HomePage';
import AdminLogin from './components/admin/AdminLogin';
import StudentLogin from './components/student/StudentLogin';
import StudentRegister from './components/student/StudentRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import TakeTest from './components/student/TakeTest';
import TestResults from './components/student/TestResults';
import QuestionManagement from './components/admin/QuestionManagement';
import CourseManagement from './components/admin/CourseManagement';
import StudentResults from './components/admin/StudentResults';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/test/:courseId" 
              element={
                <ProtectedRoute role="student">
                  <TakeTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/results" 
              element={
                <ProtectedRoute role="student">
                  <TestResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/questions" 
              element={
                <ProtectedRoute role="admin">
                  <QuestionManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <ProtectedRoute role="admin">
                  <CourseManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/student-results" 
              element={
                <ProtectedRoute role="admin">
                  <StudentResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
