import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';
import {login} from '../../redux/authSlice.js';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      const { jwt, user } = response.data; // 응답에서 jwt와 user를 가져옴
      dispatch(login({ token: jwt, user }));
      navigate('/');
    } catch (err) {
      setError('로그인에 실패했습니다. 사용자명과 비밀번호를 확인하세요.');
    }
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          로그인
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="아이디 입력"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="비밀번호"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            로그인
          </Button>
        </form>
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleNavigateToRegister}
          >
            회원가입
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
