import React from 'react';
import {List, ListItem, ListItemIcon} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People'; // Import PeopleIcon
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
      </List>
    </Box>
  );
};
