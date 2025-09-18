import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUserShield, FaClipboardList, FaChartBar } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 mb-3">CBT Platform</h1>
              <p className="lead">
                A comprehensive Computer-Based Testing platform for educational institutions.
                Take tests online with instant results and detailed analytics.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Portal Selection */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="text-center mb-5">Choose Your Portal</h2>
            <Row className="g-4">
              {/* Student Portal */}
              <Col md={6}>
                <Card className="h-100 shadow-lg portal-card">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <FaUserGraduate size={60} className="text-primary" />
                    </div>
                    <Card.Title className="h3 mb-3">Student Portal</Card.Title>
                    <Card.Text className="mb-4">
                      Register, take tests, view results, and track your academic progress.
                      Access course-specific tests and get instant feedback on your performance.
                    </Card.Text>
                    <div className="d-grid gap-2">
                      <Button as={Link} to="/student/login" variant="primary" size="lg">
                        Student Login
                      </Button>
                      <Button as={Link} to="/student/register" variant="outline-primary" size="lg">
                        New Student? Register
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Admin Portal */}
              <Col md={6}>
                <Card className="h-100 shadow-lg portal-card">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <FaUserShield size={60} className="text-success" />
                    </div>
                    <Card.Title className="h3 mb-3">Admin Portal</Card.Title>
                    <Card.Text className="mb-4">
                      Manage questions, courses, and view comprehensive student results.
                      Create and edit tests, monitor student progress, and generate reports.
                    </Card.Text>
                    <div className="d-grid gap-2">
                      <Button as={Link} to="/admin/login" variant="success" size="lg">
                        Admin Login
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mt-5 pt-5">
          <Col>
            <h2 className="text-center mb-5">Platform Features</h2>
            <Row className="g-4">
              <Col md={4}>
                <Card className="text-center h-100 border-0 shadow-sm">
                  <Card.Body>
                    <FaClipboardList size={40} className="text-primary mb-3" />
                    <Card.Title>Interactive Tests</Card.Title>
                    <Card.Text>
                      Take tests with multiple choice questions, immediate feedback, and progress tracking.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center h-100 border-0 shadow-sm">
                  <Card.Body>
                    <FaChartBar size={40} className="text-success mb-3" />
                    <Card.Title>Detailed Analytics</Card.Title>
                    <Card.Text>
                      View comprehensive results, performance analytics, and progress reports.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center h-100 border-0 shadow-sm">
                  <Card.Body>
                    <FaUserShield size={40} className="text-info mb-3" />
                    <Card.Title>Secure Platform</Card.Title>
                    <Card.Text>
                      Secure login system with separate portals for students and administrators.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>
          <p className="mb-0">&copy; 2025 CBT Platform. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;