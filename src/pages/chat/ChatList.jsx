import React, {useEffect, useState} from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import {List, ListItem, ListItemText} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

export const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        if (!user || !user.id) {
          console.error('User is not authenticated');
          return;
        }
        const response = await axiosInstance.get(`/chatrooms/user/${user.id}`);
        if (response.data) {
          setChatRooms(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
      }
    };

    if (user && user.id) {
      fetchChatRooms();
    }
  }, [user]);

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <List>
      {Array.isArray(chatRooms) && chatRooms.length > 0 ? (
        chatRooms.map((room) => (
          <ListItem key={room.id} button onClick={() => handleRoomClick(room.id)}>
            <ListItemText
              primary={room.name}
              secondary={room.latestMessage ? `${room.latestMessage.content}` : 'No messages yet'}
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No chat rooms available" />
        </ListItem>
      )}
    </List>
  );
};
