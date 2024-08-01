import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from '../../utils/axiosInstance';
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {red} from '@mui/material/colors';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();

  useEffect(() => {
    axios.get(`/board/${id}`)
      .then(response => {
        setPost(response.data);
        fetchProfileImage(response.data.userId);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          alert('해당 게시물이 존재하지 않습니다');
        }
      });
  }, [id]);

  async function fetchProfileImage(userId) {
    try {
      const res = await axios.get(`/member/${userId}`);
      setProfileImage(res.data.imageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  }

  const handleDelete = () => {
    axios.delete(`/board/${id}`)
      .then(() => {
        alert('게시물이 삭제되었습니다');
        navigate('/board');
      })
      .catch(() => {
        alert('삭제 실패');
      })
      .finally(() => setOpenDeleteModal(false));
  };

  if (post === null) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/board')}
        sx={{ mb: 2 }}
      >
        게시판으로 돌아가기
      </Button>
      <Card>
        <CardHeader
          avatar={
            profileImage ? (
              <Avatar src={profileImage} />
            ) : (
              <Avatar>{post.username.charAt(0)}</Avatar>
            )
          }
          title={post.title}
          subheader={new Date(post.createdAt).toLocaleString()}
          action={
            user && user.id === post.userId && (
              <Box>
                <Tooltip title="수정">
                  <IconButton
                    onClick={() => navigate(`/board/edit/${id}`)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton
                    onClick={() => setOpenDeleteModal(true)}
                    sx={{ color: red[500] }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }
        />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
        </CardContent>
      </Card>
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openDeleteModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              게시물을 삭제하시겠습니까?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDelete}
              >
                삭제
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenDeleteModal(false)}
                sx={{ ml: 2 }}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default BoardDetail;
