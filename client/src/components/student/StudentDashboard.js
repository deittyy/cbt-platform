import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaClipboardList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="student-dashboard">
      {/* Navigation */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <FaUserGraduate className="me-2" />
            CBT Student Portal
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/student/results">My Results</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                Welcome, {user?.firstName} ({user?.studentId})
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" />
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1>Welcome, {user?.firstName}!</h1>
            <p className="text-muted">Course: {user?.course}</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaClipboardList size={40} className="text-primary mb-3" />
                <Card.Title>Take Test</Card.Title>
                <Card.Text>
                  Start a new test for your course
                </Card.Text>
                <Button variant="primary" disabled>
                  No tests available
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaChartBar size={40} className="text-success mb-3" />
                <Card.Title>View Results</Card.Title>
                <Card.Text>
                  Check your test results and scores
                </Card.Text>
                <Button as={Link} to="/student/results" variant="success">
                  View Results
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Student Stats */}
        <Row className="mt-5">
          <Col>
            <h3>Your Progress</h3>
            <Row className="g-3">
              <Col sm={6} md={3}>
                <Card className="bg-primary text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Tests Taken</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>0%</h4>
                    <p className="mb-0">Average Score</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-info text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Tests Passed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>-</h4>
                    <p className="mb-0">Last Score</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;