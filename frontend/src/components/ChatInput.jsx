import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit} className="position-relative max-w-3xl mx-auto w-100">
      <Form.Control
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        disabled={disabled}
        className="bg-dark text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        variant="link"
        className="position-absolute top-50 end-0 translate-middle-y text-primary hover:text-info disabled:text-muted"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </Button>
    </Form>
  );
};

export default ChatInput;
