import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', {
        username,
        password,
        email,
        name,
        birthdate,
        cellphone,
      });
      navigate('/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          회원가입
        </Typography>
        <form onSubmit={handleRegister}>
          <Box mb={2}>
            <TextField
              label="아이디"
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
          <Box mb={2}>
            <TextField
              label="이메일"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="이름"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="생년월일"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="휴대폰 번호"
              variant="outlined"
              fullWidth
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            회원가입
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
