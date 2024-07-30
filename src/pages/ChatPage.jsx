import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect, disconnect, sendMessage} from '../app/websocketService';
import {useSelector} from 'react-redux';
import {Box, Button, TextField, Typography} from '@mui/material';

export const ChatPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onMessageReceived = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    connect(onMessageReceived, id);

    return () => {
      disconnect();
    };
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({
        chatRoomId: id,
        content: message,
        sender: user.username,
      });
      setMessage('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Chat Room {id}</Typography>
      <Box sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 2, height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === user.username ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{
              backgroundColor: msg.sender === user.username ? '#e0f7fa' : '#f1f8e9',
              borderRadius: 2,
              p: 1,
              maxWidth: '70%',
            }}>
              {msg.sender}: {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>
    </Box>
  );
};
