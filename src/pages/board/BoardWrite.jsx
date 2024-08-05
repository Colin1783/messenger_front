import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from '../../utils/axiosInstance';
import {Box, Button, Container, TextField, Typography} from '@mui/material';

export const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/board', { title, content, userId: user.id })
      .then(() => navigate('/board'))
      .catch(error => console.error('게시글 작성 실패:', error));
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          새 글 작성
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="내용"
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              작성
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
