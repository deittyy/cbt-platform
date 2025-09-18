import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaBook } from 'react-icons/fa';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    duration: 60,
    totalQuestions: 20,
    passingScore: 70,
    instructions: 'Please read each question carefully and select the best answer.'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'totalQuestions' || name === 'passingScore' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description || '',
        duration: course.duration,
        totalQuestions: course.totalQuestions,
        passingScore: course.passingScore,
        instructions: course.instructions
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        duration: 60,
        totalQuestions: 20,
        passingScore: 70,
        instructions: 'Please read each question carefully and select the best answer.'
      });
    }
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse._id}`, formData);
        setSuccess('Course updated successfully!');
      } else {
        await axios.post('/api/courses', formData);
        setSuccess('Course created successfully!');
      }
      
      fetchCourses();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving course');
    }
  };

  const toggleCourseStatus = async (courseId) => {
    try {
      await axios.patch(`/api/courses/${courseId}/toggle-status`);
      fetchCourses();
      setSuccess('Course status updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update course status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        fetchCourses();
        setSuccess('Course deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete course');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading courses...</p>
      </Container>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2><FaBook className="me-2" />Course Management</h2>
            <Button variant="success" onClick={() => openModal()}>
              <FaPlus className="me-2" />Add New Course
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Courses ({courses.length})</h5>
            </Card.Header>
            <Card.Body>
              {courses.length === 0 ? (
                <div className="text-center py-4">
                  <FaBook size={48} className="text-muted mb-3" />
                  <p className="text-muted">No courses created yet. Add your first course to get started!</p>
                  <Button variant="success" onClick={() => openModal()}>
                    <FaPlus className="me-2" />Create First Course
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Code</th>
                      <th>Duration</th>
                      <th>Questions</th>
                      <th>Pass Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course._id}>
                        <td>
                          <strong>{course.name}</strong>
                          {course.description && (
                            <small className="d-block text-muted">{course.description}</small>
                          )}
                        </td>
                        <td><Badge bg="primary">{course.code}</Badge></td>
                        <td>{course.duration} mins</td>
                        <td>{course.totalQuestions}</td>
                        <td>{course.passingScore}%</td>
                        <td>
                          <Badge bg={course.isActive ? 'success' : 'secondary'}>
                            {course.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openModal(course)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={course.isActive ? 'outline-warning' : 'outline-success'}
                            size="sm"
                            className="me-2"
                            onClick={() => toggleCourseStatus(course._id)}
                          >
                            {course.isActive ? <FaToggleOff /> : <FaToggleOn />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteCourse(course._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the course content..."
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Questions</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalQuestions"
                    value={formData.totalQuestions}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Passing Score (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Test Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Instructions that students will see before taking the test..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </Container>
    </div>
  );
};

export default CourseManagement;
