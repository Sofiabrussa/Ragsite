import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const API_URL = "http://localhost:8000";

function Chat() {
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/session`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setSessionId(data.session_id));
  }, []);

  const sendMessage = async () => {
    const res = await fetch(`${API_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session_id': sessionId
      },
      body: JSON.stringify({ query: input })
    });

    const data = await res.json();
    setMessages([...messages, { user: input, bot: data.response.response }]);
    setInput('');
  };

  return (
    <Container className="p-4">
      <h2>Chat con RAG</h2>
      <Card className="p-3 mb-3">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>Usuario:</strong> {m.user}<br />
            <strong>Asistente:</strong> {m.bot}<hr />
          </div>
        ))}
      </Card>
      <Form.Group>
        <Form.Control
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribí tu mensaje..."
        />
      </Form.Group>
      <Button onClick={sendMessage} className="mt-2">Enviar</Button>
    </Container>
  );
}

export default Chat;
