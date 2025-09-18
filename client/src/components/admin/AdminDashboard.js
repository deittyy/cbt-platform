import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserShield, FaQuestionCircle, FaBook, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-dashboard">
      {/* Navigation */}
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <FaUserShield className="me-2" />
            CBT Admin Portal
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/courses">Courses</Nav.Link>
              <Nav.Link as={Link} to="/admin/questions">Questions</Nav.Link>
              <Nav.Link as={Link} to="/admin/student-results">Results</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                Welcome, {user?.firstName} ({user?.adminId})
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
            <h1>Admin Dashboard</h1>
            <p className="text-muted">Manage your CBT platform</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaBook size={40} className="text-primary mb-3" />
                <Card.Title>Manage Courses</Card.Title>
                <Card.Text>
                  Create, edit, and manage course offerings
                </Card.Text>
                <Button as={Link} to="/admin/courses" variant="primary">
                  Go to Courses
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaQuestionCircle size={40} className="text-success mb-3" />
                <Card.Title>Manage Questions</Card.Title>
                <Card.Text>
                  Add, edit, and organize test questions
                </Card.Text>
                <Button as={Link} to="/admin/questions" variant="success">
                  Go to Questions
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaChartBar size={40} className="text-info mb-3" />
                <Card.Title>Student Results</Card.Title>
                <Card.Text>
                  View and analyze student performance
                </Card.Text>
                <Button as={Link} to="/admin/student-results" variant="info">
                  View Results
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaUserShield size={40} className="text-warning mb-3" />
                <Card.Title>Admin Settings</Card.Title>
                <Card.Text>
                  Platform settings and configuration
                </Card.Text>
                <Button variant="warning" disabled>
                  Coming Soon
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mt-5">
          <Col>
            <h3>Quick Overview</h3>
            <Row className="g-3">
              <Col sm={6} md={3}>
                <Card className="bg-primary text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Total Courses</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-success text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Total Questions</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-info text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Active Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={3}>
                <Card className="bg-warning text-white">
                  <Card.Body className="text-center">
                    <h4>0</h4>
                    <p className="mb-0">Tests Taken</p>
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

export default AdminDashboard;