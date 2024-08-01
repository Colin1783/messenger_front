import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import axios from '../../utils/axiosInstance';

export const BoardList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/board')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // 페이지를 1로 초기화
  };

  const handleRowClick = (id) => {
    navigate(`/board/${id}`); // 게시글 ID에 따라 페이지 이동
  };

  const handleNewPost = () => {
    navigate('/board/new'); // 새 글 작성 페이지로 이동
  };

  const totalPages = Math.ceil(posts.length / rowsPerPage);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        게시판
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          onClick={handleNewPost}
          variant="contained"
          color="primary"
        >
          새 글 작성
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%', textAlign: 'center' }}>제목</TableCell>
              <TableCell sx={{ width: '60%', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>내용</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>작성자</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center' }}>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.slice((page - 1) * rowsPerPage, page * rowsPerPage).map(post => (
              <TableRow
                key={post.id}
                onClick={() => handleRowClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {post.title}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.content}
                </TableCell>
                <TableCell>{post.username}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <FormControl variant="outlined" size="small">
          <InputLabel>행 수</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="행 수"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
};
