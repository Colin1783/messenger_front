import React from 'react';
import {List, ListItem, ListItemIcon} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Calendar Icon 추가
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 100, backgroundColor: '#f4f4f4', height: '100vh', boxShadow: 2 }}>
      <List component="nav">
        <ListItem button onClick={() => navigate('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button onClick={() => navigate('/chat')}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button onClick={() => navigate('/friends')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button onClick={() => navigate('/board')}>
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button onClick={() => navigate('/calendar')}> {/* Calendar 경로 추가 */}
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    </Box>
  );
};
