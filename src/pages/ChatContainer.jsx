import React from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {Box, Typography} from '@mui/material';
import {ChatListPage} from './ChatListPage.jsx';

export const ChatContainer = () => {
  const { id } = useParams();

  return (
    <Box display="flex" height="100vh" sx={{backgroundColor: '#fff'}}>
      <Box sx={{ width: '25%', borderRight: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <ChatListPage />
      </Box>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {id ? <Outlet /> : <Typography variant="h6">채팅방을 선택하세요</Typography>}
      </Box>
    </Box>
  );
};
