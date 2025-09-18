import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge, ButtonGroup } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle, FaEye } from 'react-icons/fa';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    correctAnswer: '',
    explanation: '',
    course: '',
    difficulty: 'medium',
    points: 1,
    tags: []
  });

  useEffect(() => {
    fetchCourses();
    fetchQuestions();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const params = selectedCourse ? { course: selectedCourse } : {};
      const response = await axios.get('/api/questions', { params });
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 1 : value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    
    // If setting this option as correct, make others incorrect
    if (field === 'isCorrect' && value) {
      newOptions.forEach((option, i) => {
        if (i !== index) option.isCorrect = false;
      });
      // Update correct answer
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: newOptions[index].text
      }));
    } else {
      setFormData(prev => ({ ...prev, options: newOptions }));
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, options: newOptions }));
    }
  };

  const openModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options.length > 0 ? question.options : [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        course: question.course._id || question.course,
        difficulty: question.difficulty,
        points: question.points,
        tags: question.tags || []
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        questionText: '',
        questionType: 'multiple-choice',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: '',
        explanation: '',
        course: selectedCourse,
        difficulty: 'medium',
        points: 1,
        tags: []
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

    // Validation
    if (!formData.questionText.trim()) {
      setError('Question text is required');
      return;
    }
    if (!formData.course) {
      setError('Please select a course');
      return;
    }
    
    const hasCorrectAnswer = formData.options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      setError('Please mark at least one option as correct');
      return;
    }

    try {
      const submitData = {
        ...formData,
        correctAnswer: formData.options.find(opt => opt.isCorrect)?.text || formData.correctAnswer
      };

      if (editingQuestion) {
        await axios.put(`/api/questions/${editingQuestion._id}`, submitData);
        setSuccess('Question updated successfully!');
      } else {
        await axios.post('/api/questions', submitData);
        setSuccess('Question created successfully!');
      }
      
      fetchQuestions();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving question');
    }
  };

  const deleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/questions/${questionId}`);
        fetchQuestions();
        setSuccess('Question deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete question');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const previewQuestionModal = (question) => {
    setPreviewQuestion(question);
    setShowPreviewModal(true);
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading questions...</p>
      </Container>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <Container className="py-4">
      <Row className="mb-4">
        <Col md={8}>
          <h2><FaQuestionCircle className="me-2" />Question Management</h2>
        </Col>
        <Col md={4} className="text-end">
          <div className="d-flex gap-2">
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="me-2"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </Form.Select>
            <Button variant="success" onClick={() => openModal()}>
              <FaPlus className="me-2" />Add Question
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
              <h5 className="mb-0">
                Questions ({questions.length})
                {selectedCourse && (
                  <Badge bg="primary" className="ms-2">
                    {courses.find(c => c._id === selectedCourse)?.name || 'Selected Course'}
                  </Badge>
                )}
              </h5>
            </Card.Header>
            <Card.Body>
              {questions.length === 0 ? (
                <div className="text-center py-4">
                  <FaQuestionCircle size={48} className="text-muted mb-3" />
                  <p className="text-muted">
                    {selectedCourse 
                      ? 'No questions created for this course yet.' 
                      : 'No questions created yet. Add your first question to get started!'}
                  </p>
                  <Button variant="success" onClick={() => openModal()}>
                    <FaPlus className="me-2" />Create First Question
                  </Button>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th style={{width: '40%'}}>Question</th>
                      <th>Course</th>
                      <th>Type</th>
                      <th>Difficulty</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map(question => (
                      <tr key={question._id}>
                        <td>
                          <div className="question-preview">
                            {question.questionText.length > 100 
                              ? question.questionText.substring(0, 100) + '...'
                              : question.questionText}
                            {question.tags && question.tags.length > 0 && (
                              <div className="mt-1">
                                {question.tags.map((tag, idx) => (
                                  <Badge key={idx} bg="secondary" className="me-1" style={{fontSize: '0.7em'}}>
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary">
                            {question.course?.code || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">
                            {question.questionType === 'multiple-choice' ? 'MCQ' : question.questionType}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            bg={question.difficulty === 'easy' ? 'success' : 
                                question.difficulty === 'medium' ? 'warning' : 'danger'}
                          >
                            {question.difficulty}
                          </Badge>
                        </td>
                        <td>{question.points}</td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-info"
                              onClick={() => previewQuestionModal(question)}
                              title="Preview"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() => openModal(question)}
                              title="Edit"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => deleteQuestion(question._id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </Button>
                          </ButtonGroup>
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

      {/* Question Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Course *</Form.Label>
              <Form.Select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Question Text *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                placeholder="Enter your question here..."
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleInputChange}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Points</Form.Label>
                  <Form.Control
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Answer Options *</Form.Label>
              {formData.options.map((option, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Check
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                    className="me-2"
                  />
                  {formData.options.length > 2 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
              {formData.options.length < 6 && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={addOption}
                  className="mt-2"
                >
                  <FaPlus className="me-1" />Add Option
                </Button>
              )}
              <Form.Text className="text-muted">
                Select the radio button next to the correct answer
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Explanation (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                placeholder="Explain why this is the correct answer (shown to students after test)..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              {editingQuestion ? 'Update Question' : 'Create Question'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Question Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewQuestion && (
            <div>
              <div className="mb-3">
                <h5>{previewQuestion.questionText}</h5>
              </div>
              <div className="mb-3">
                {previewQuestion.options.map((option, index) => (
                  <div key={index} className={`p-2 mb-2 border rounded ${
                    option.isCorrect ? 'bg-success-subtle border-success' : ''
                  }`}>
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option.text}
                    {option.isCorrect && (
                      <Badge bg="success" className="ms-2">Correct</Badge>
                    )}
                  </div>
                ))}
              </div>
              {previewQuestion.explanation && (
                <div className="mb-3">
                  <h6>Explanation:</h6>
                  <p className="text-muted">{previewQuestion.explanation}</p>
                </div>
              )}
              <div className="d-flex gap-2">
                <Badge bg="info">{previewQuestion.questionType}</Badge>
                <Badge bg={previewQuestion.difficulty === 'easy' ? 'success' : 
                           previewQuestion.difficulty === 'medium' ? 'warning' : 'danger'}>
                  {previewQuestion.difficulty}
                </Badge>
                <Badge bg="secondary">{previewQuestion.points} points</Badge>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </div>
  );
};

export default QuestionManagement;
