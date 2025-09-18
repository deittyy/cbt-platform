import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TestResults = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Test Results</Card.Title>
              <Card.Text>This feature will display student test results and scores.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestResults;