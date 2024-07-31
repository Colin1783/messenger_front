import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect, disconnect, sendMessage} from '../app/websocketService';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button, CircularProgress, Paper, TextField, Typography} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import {addMessage} from '../redux/chatSlice.js';
import {format, parseISO} from 'date-fns';
import {ko} from 'date-fns/locale';

export const ChatPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.messages);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd a h:mm", { locale: ko });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/messages/chatroom/${id}`);
        if (response.data) {
          const validMessages = response.data.map((msg) => ({
            ...msg,
            chatRoomId: msg.chatRoomId || id,
            senderId: msg.senderId || 'Unknown',
            createdAt: msg.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
          }));
          validMessages.forEach((msg) => {
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
      fetchMessages();
      connect(onMessageReceived, id, dispatch, user.id);
    }

    return () => {
      disconnect();
    };
  }, [id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onMessageReceived = (msg) => {
    const formattedMsg = {
      ...msg,
      createdAt: new Date(msg.created_at).toISOString(),
      created_at: undefined,
    };

    if (!messages.find((m) => m.id === formattedMsg.id && m.createdAt === formattedMsg.createdAt)) {
      dispatch(addMessage(formattedMsg));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        chatRoomId: id,
        content: message,
        senderId: user.id,
        username: user.username,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      sendMessage(messageData);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <Box sx={{ flexGrow: 1, mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 2, overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <Box
            key={`${msg.chatRoomId}-${msg.createdAt}`}
            sx={{
              display: 'flex',
              justifyContent: Number(msg.senderId) === Number(user.id) ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                backgroundColor: Number(msg.senderId) === Number(user.id) ? '#cfe8fc' : '#ffffff',
                borderRadius: 2,
                p: 2,
                maxWidth: '70%',
                wordWrap: 'break-word',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {Number(msg.senderId) !== Number(user.id) && msg.username}
              </Typography>
              <Typography variant="body1">
                {msg.content}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                {msg.createdAt ? formatDate(msg.createdAt) : 'Unknown date'}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          minRows={1}
          maxRows={4}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Box>
  );
};
