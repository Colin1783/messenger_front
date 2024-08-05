import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from '../../utils/axiosInstance';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();

  useEffect(() => {
    axios.get(`/board/${id}`)
      .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('게시글을 가져오는 데 실패했습니다:', error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/board/${id}`, { title, content })
      .then(() => navigate(`/board/${id}`))
      .catch(error => console.error('게시글을 업데이트하는 데 실패했습니다:', error));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            게시글 수정
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
                InputProps={{
                  sx: { bgcolor: theme.palette.background.paper }
                }}
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
                InputProps={{
                  sx: { bgcolor: theme.palette.background.paper }
                }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                수정
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BoardEdit;
