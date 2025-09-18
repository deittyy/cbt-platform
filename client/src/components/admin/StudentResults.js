import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const StudentResults = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Student Results</Card.Title>
              <Card.Text>This feature will display all student test results and analytics.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentResults;