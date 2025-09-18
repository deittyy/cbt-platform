import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const QuestionManagement = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Question Management</Card.Title>
              <Card.Text>This feature will allow admins to create, edit, and manage test questions.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionManagement;