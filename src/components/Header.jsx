import React from 'react';
import {useDispatch} from 'react-redux';
import {AppBar, Box, Button, IconButton, TextField, Toolbar, Typography} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from 'react-router-dom';
import {logout} from "../redux/authSlice.jsx";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Redux 스토어에서 로그아웃 처리
    localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
    navigate('/login'); // 로그인 페이지로 리디렉션
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          콜챗 메신저
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '2px 8px',
            marginRight: 2,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
              },
              marginRight: 1,
            }}
          />
          <Button variant="contained" color="primary">
            <Typography variant="button" color="inherit">검색</Typography>
          </Button>
        </Box>
        <IconButton color="inherit" onClick={() => navigate('/settings')}>
          <SettingsIcon />
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>로그아웃</Button> {/* 로그아웃 버튼 추가 */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
