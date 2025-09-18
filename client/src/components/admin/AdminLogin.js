import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData, 'admin');
    
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="admin-login min-vh-100 bg-light d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-success text-white text-center py-4">
                <FaUserShield size={50} className="mb-3" />
                <h2 className="mb-0">Admin Portal</h2>
                <p className="mb-0 opacity-75">Secure Administrator Login</p>
              </Card.Header>
              <Card.Body className="p-5">
                {error && (
                  <Alert variant="danger" dismissible onClose={clearError}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Admin ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="Enter your Admin ID"
                      required
                      disabled={isLoading}
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        size="lg"
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        style={{ zIndex: 10 }}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Logging in...
                        </>
                      ) : (
                        'Login to Admin Portal'
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />
                
                <div className="text-center">
                  <p className="text-muted mb-0">
                    <Link to="/" className="text-decoration-none">
                      ← Back to Home
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Security Notice */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <FaUserShield className="me-1" />
                This is a secure administrator portal. Only authorized personnel should access this area.
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;