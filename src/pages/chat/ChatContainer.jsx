import React, {useState} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Box, Typography} from '@mui/material';
import {ChatList} from './ChatList.jsx';

export const ChatContainer = () => {
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    navigate(`/chat/${roomId}`);
  };

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: '#fff' }}>
      <Box sx={{ width: '25%', borderRight: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <ChatList onRoomSelect={handleRoomSelect} />
      </Box>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {id ? <Outlet context={{ selectedRoom, setSelectedRoom }} /> : <Typography variant="h6">채팅방을 선택하세요</Typography>}
      </Box>
    </Box>
  );
};
