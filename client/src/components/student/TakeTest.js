import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TakeTest = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Take Test</Card.Title>
              <Card.Text>This feature will allow students to take tests with multiple choice questions.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TakeTest;