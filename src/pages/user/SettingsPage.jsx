import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import axiosInstance from '../../utils/axiosInstance.js';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';

export const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [birthdate, setBirthdate] = useState(user.birthdate);
  const [cellphone, setCellphone] = useState(user.cellphone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/users/update', {
        id: user.id,
        email,
        name,
        birthdate,
        cellphone,
        currentPassword,
        newPassword,
      });
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setError('');
    } catch (err) {
      setError('업데이트 실패. 다시 시도해 주세요.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          설정
        </Typography>
        <form onSubmit={handleUpdate}>
          <Box mb={2}>
            <TextField
              label="사용자명"
              variant="outlined"
              fullWidth
              value={user.username}
              InputProps={{
                readOnly: true,
              }}
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
          <Box mb={2}>
            <TextField
              label="현재 비밀번호"
              type="password"
              variant="outlined"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="새 비밀번호"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" gutterBottom>
              {success}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            업데이트
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
