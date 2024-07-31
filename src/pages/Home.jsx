import React from 'react';
import {Outlet} from 'react-router-dom';

import {Box} from '@mui/material';
import Header from "../components/Header.jsx";
import {NavBar} from "../components/NavBar.jsx";

export const Home = () => {
  return (
    <div style={{backgroundColor: '#fff', minHeight: '100vh'}}>
      <Header />
      <Box display="flex">
        <NavBar />
        <Box sx={{flexGrow: 1, padding: 2}}>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};
