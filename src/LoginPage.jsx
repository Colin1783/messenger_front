import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {login} from "./authSlice.jsx";

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.jwt);
      dispatch(login({ user: response.data.user }));
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>{error}</Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
        </form>
        <Box mt={2}>
          <Typography variant="body1" align="center">Don't have an account?</Typography>
          <Button variant="outlined" color="primary" fullWidth onClick={() => navigate('/register')}>Register</Button>
        </Box>
      </Box>
    </Container>
  );
};
