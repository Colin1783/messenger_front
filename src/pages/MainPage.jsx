import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {Box, Button, Card, CardContent, Container, List, ListItem, ListItemText, Typography} from '@mui/material';
import {logout} from "../redux/authSlice.jsx";

export const MainPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user ? user.name : 'Guest'}!
        </Typography>
        {user && (
          <>
            <Typography variant="body1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Button variant="outlined" color="primary" component={Link} to="/settings">
              Edit Profile
            </Button>
          </>
        )}
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Announcements
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6">New Feature Released!</Typography>
              <Typography variant="body2">
                We have introduced a new feature to enhance your experience. Check it out now!
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Recommended Friends
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="John Doe" secondary="2 mutual friends" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Jane Smith" secondary="3 mutual friends" />
            </ListItem>
          </List>
        </Box>
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Recent Activities
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Joined 'React Developers' group" secondary="2 hours ago" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Shared a photo in 'Family Chat'" secondary="1 day ago" />
            </ListItem>
          </List>
        </Box>
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Quick Links
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/new-message">
            New Message
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/upload-file" sx={{ ml: 2 }}>
            Upload File
          </Button>
        </Box>
        <Box mt={5}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
