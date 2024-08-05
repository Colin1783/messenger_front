import React, {useEffect, useState} from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import {Box, Card, CardContent, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

export const ChatList = ({ onRoomSelect }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        if (!user || !user.id) {
          console.error('사용자가 인증되지 않았습니다.');
          return;
        }
        const response = await axiosInstance.get(`/chatrooms/user/${user.id}`);
        if (response.data) {
          setChatRooms(response.data);
        } else {
          console.error('응답 형식이 예상과 다릅니다:', response);
        }
      } catch (error) {
        console.error('채팅방을 가져오는 데 실패했습니다:', error);
      }
    };

    if (user && user.id) {
      fetchChatRooms();
    }
  }, [user]);

  const handleRoomClick = (roomId) => {
    onRoomSelect(roomId);
    navigate(`/chat/${roomId}`);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {Array.isArray(chatRooms) && chatRooms.length > 0 ? (
        chatRooms.map((room) => {
          if (!room || !room.otherUser) return null;

          const roomName = room.otherUser.username || '알 수 없는 사용자';

          return (
            <Card
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              sx={{ marginBottom: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{roomName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {room.latestMessage ? `${room.latestMessage.content}` : '메시지가 없습니다'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body2" color="textSecondary">
          사용 가능한 채팅방이 없습니다
        </Typography>
      )}
    </Box>
  );
};
