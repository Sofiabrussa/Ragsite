import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Spinner, Container } from 'react-bootstrap';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/session', {
          method: 'POST',
        });
        const data = await response.json();
        setSessionId(data.session_id);
        console.log('Sesión creada:', data.session_id);
      } catch (error) {
        console.error('Error al crear la sesión:', error);
      }
    };

    createSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || !sessionId) return;

    const userMessage = { id: Date.now().toString(), content: message, role: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session_id': sessionId,
        },
        body: JSON.stringify({ query: message }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: (Date.now() + 1).toString(), content: data.response.response || data.response, role: 'assistant' },
      ]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: (Date.now() + 1).toString(), content: 'Lo siento, ha ocurrido un error al procesar tu solicitud.', role: 'assistant' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column h-100">
      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <Row className="h-100 d-flex justify-content-center align-items-center">
            <Col xs="auto" className="text-center">
              <h2 className="display-4 mb-4">¡Bienvenido al chatbot de MiEmpresa!</h2>
              <p className="text-muted mb-4">
                Puedes hacerme cualquier pregunta y te responderé con la información disponible.
              </p>
            </Col>
          </Row>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
        {loading && (
          <Row className="p-4 text-center">
            <Col>
              <Spinner animation="border" variant="light" />
              <span className="d-inline-block ms-3">Pensando...</span>
            </Col>
          </Row>
        )}
      </div>
      <Card className="p-4 border-top border-dark">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </Card>
    </Container>
  );
};

export default ChatContainer;
