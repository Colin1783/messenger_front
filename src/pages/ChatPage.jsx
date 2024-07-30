import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect, disconnect, sendMessage} from '../app/websocketService';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button, CircularProgress, TextField, Typography} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import {addMessage} from '../redux/chatSlice.js';
import {format, parseISO} from 'date-fns';

export const ChatPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.messages);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/messages/chatroom/${id}`);
        if (response.data) {
          const validMessages = response.data.map(msg => ({
            ...msg,
            chatRoomId: msg.chatRoomId || id,
            senderId: msg.senderId || 'Unknown',
            createdAt: msg.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
          }));
          validMessages.forEach(msg => {
            console.log('Fetched message:', msg);
            dispatch(addMessage(msg));
          });
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Connecting to WebSocket with chatRoomId:', id);
      fetchMessages();
      connect(onMessageReceived, id);
    }

    return () => {
      disconnect();
    };
  }, [id, dispatch]);

  const onMessageReceived = (msg) => {
    console.log('Message received from WebSocket:', msg);
    if (msg.created_at) {
      // created_at의 형식을 ISO 8601로 변환
      msg.createdAt = msg.created_at.replace(' ', 'T');
    }
    dispatch(addMessage(msg));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        chatRoomId: id,
        content: message,
        senderId: user.id,
        username: user.username,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      console.log('Sending message:', messageData);
      sendMessage(messageData);
      setMessage('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading chat room...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Chat Room {id}</Typography>
      <Box sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 2, height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <Box
            key={`${msg.id}-${new Date(msg.createdAt).getTime()}`}
            sx={{
              display: 'flex',
              justifyContent: Number(msg.senderId) === Number(user.id) ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{
              backgroundColor: Number(msg.senderId) === Number(user.id) ? '#e0f7fa' : '#f1f8e9',
              borderRadius: 2,
              p: 1,
              maxWidth: '70%',
            }}>
              { Number(msg.senderId) === Number(user.id) ? 'You' : msg.username}: {msg.content}
              <br />
              <small>{msg.createdAt ? format(parseISO(msg.createdAt), 'PPpp') : 'Unknown date'}</small>
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
