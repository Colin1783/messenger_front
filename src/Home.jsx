import React from 'react';
import {Outlet} from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import {Box, Container} from '@mui/material';

export const Home = () => {
  return (
    <div>
      <Header />
      <Box display="flex">
        <NavBar />
        <Container sx={{flexGrow: 1, padding: 2}}>
          <Outlet />
        </Container>
      </Box>
    </div>
  );
};
