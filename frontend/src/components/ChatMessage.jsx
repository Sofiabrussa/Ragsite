import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const ChatMessage = ({ message }) => {
  return (
    <Card className={`py-4 px-3 border-bottom w-100 ${message.role === 'assistant' ? 'bg-dark' : 'bg-secondary'}`}>
      <Row className="justify-content-center">
        <Col xs="auto" className="d-flex align-items-center">
          {message.role === 'user' ? (
            <div className="h-8 w-8 rounded-circle bg-primary d-flex align-items-center justify-content-center text-white font-weight-bold">
              U
            </div>
          ) : (
            <div className="h-8 w-8 rounded-circle bg-success d-flex align-items-center justify-content-center text-white font-weight-bold">
              A
            </div>
          )}
        </Col>
        <Col className="d-flex align-items-center">
          <div className="text-white" style={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ChatMessage;
