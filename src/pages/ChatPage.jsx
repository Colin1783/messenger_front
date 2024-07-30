import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect, disconnect, sendMessage} from '../app/websocketService';
import {useSelector} from 'react-redux';
import {Box, Button, TextField, Typography} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

export const ChatPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/messages/chatroom/${id}`);
        if (response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    const onMessageReceived = (msg) => {
      console.log('Message received from WebSocket:', msg);
      setMessages((prevMessages) => {
        if (!prevMessages.find((m) => m.id === msg.id)) {
          return [...prevMessages, msg];
        }
        return prevMessages;
      });
    };

    console.log('Connecting to WebSocket with chatRoomId:', id);
    fetchMessages();
    connect(onMessageReceived, id);

    return () => {
      disconnect();
    };
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        chatRoomId: id,
        content: message,
        senderId: user.id,
        username: user.username,
      };
      console.log('Sending message:', messageData);
      await sendMessage(messageData);
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
              justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{
              backgroundColor: msg.senderId === user.id ? '#e0f7fa' : '#f1f8e9',
              borderRadius: 2,
              p: 1,
              maxWidth: '70%',
            }}>
              {msg.senderId === user.id ? 'You' : msg.username}: {msg.content}
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
