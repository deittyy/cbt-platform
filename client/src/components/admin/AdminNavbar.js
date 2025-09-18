import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard">
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
            <Nav.Link as={Link} to="/">Home</Nav.Link>
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
  );
};

export default AdminNavbar;