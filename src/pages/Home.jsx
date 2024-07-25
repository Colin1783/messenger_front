import React from 'react';
import {Outlet} from 'react-router-dom';

import {Box, Container} from '@mui/material';
import Header from "../components/Header.jsx";
import NavBar from "../components/NavBar.jsx";

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
