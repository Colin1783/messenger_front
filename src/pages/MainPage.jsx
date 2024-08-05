import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {Box, Button, Card, CardContent, Container, Grid, List, ListItem, ListItemText, Typography} from '@mui/material';
import {logout} from "../redux/authSlice.js";

export const MainPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          {user ? `${user.name}님, 환영합니다!` : '게스트님, 환영합니다!'}
        </Typography>
        {user && (
          <>
            <Typography variant="body1" gutterBottom>
              이메일: {user.email}
            </Typography>
            <Button variant="outlined" color="primary" component={Link} to="/settings" sx={{ mb: 5 }}>
              프로필 수정
            </Button>
          </>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              공지사항
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h6">사내 메신저 개발</Typography>
                <Typography variant="body2">
                  카카오톡, 네이트온 대신 사내 메신저를 써보세요
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              추천 친구
            </Typography>
            <List>
              <ListItem button>
                <ListItemText primary="test2" secondary="2명의 공통 친구" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="test3" secondary="3명의 공통 친구" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              일정
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="프로젝트 발표" secondary="8/7" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              게시판
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="하반기 매출 증대 방안 회의" secondary="8/5" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
