import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from 'react-router-dom';
import {logout} from "../redux/authSlice";
import {NotificationComponent} from './NotificationComponent';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // 현재 로그인한 사용자 정보를 가져옴

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
        {user && ( // user가 존재할 때만 환영 메시지를 표시
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {user.username} 님 환영합니다.
          </Typography>
        )}
        <NotificationComponent /> {/* NotificationComponent 추가 */}
        <IconButton color="inherit" onClick={() => navigate('/settings')}>
          <SettingsIcon />
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>로그아웃</Button> {/* 로그아웃 버튼 추가 */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
