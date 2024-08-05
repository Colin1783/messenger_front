import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Badge, Box, Button, IconButton, ListItemText, Menu, MenuItem, Modal, Typography} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {addNotification, setNotifications} from '../redux/notificationSlice';
import axiosInstance from '../utils/axiosInstance';
import {acceptFriendRequest, setPendingRequests} from '../redux/friendsSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const NotificationComponent = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // user 정보를 JSON 파싱
  const userId = user ? user.id : null; // userId 가져오기

  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    console.log('사용자 ID로 초기 알림을 가져옵니다:', userId); // 로그 추가
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/friend-requests/pending/' + userId); // 사용자 ID를 이용해 초기 알림 가져오기
        dispatch(setNotifications(response.data));
      } catch (error) {
        console.error('알림을 가져오는 데 실패했습니다:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }

    const eventSourceUrl = `http://localhost:8080/friend-requests/notifications?token=${token}`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.addEventListener("notification", function(event) {
      console.log('새 알림을 받았습니다:', event.data);
      dispatch(addNotification(JSON.parse(event.data)));
    });

    eventSource.onerror = function(event) {
      console.error('EventSource 오류 발생:', event);
      eventSource.close();
    };

    console.log('알림을 위한 EventSource에 구독했습니다.');

    return () => {
      console.log('EventSource를 닫습니다.');
      eventSource.close();
    };
  }, [dispatch, token, userId]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRespondToRequest = async (id, requesterId, recipientId, status, requesterUsername) => {
    try {
      console.log('친구 요청에 대한 응답을 보냅니다:', { id, requesterId, recipientId, status, requesterUsername });
      await axiosInstance.post('/friend-requests/respond', {
        id,
        requesterId,
        recipientId,
        status,
        requesterUsername,
      });
      dispatch(setPendingRequests(pendingRequests.filter((request) => request.id !== id)));
      dispatch(setNotifications(notifications.filter((notification) => notification.id !== id))); // 알림 제거
      if (status === 'ACCEPTED') {
        dispatch(acceptFriendRequest({ id }));
        setModalMessage('친구로 추가되었습니다. 채팅을 시작해보세요.');
      } else {
        setModalMessage('거절하였습니다.');
      }
      setModalOpen(true);
    } catch (error) {
      console.error('친구 요청에 응답하는 데 실패했습니다:', error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {notifications.length === 0 ? (
          <MenuItem onClick={handleMenuClose}>알림이 없습니다</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index}>
              <ListItemText primary={`${notification.requesterUsername}님으로부터 친구 요청이 도착했습니다.`} />
              <div>
                <Button onClick={() => handleRespondToRequest(notification.id, notification.requesterId, notification.recipientId, 'ACCEPTED', notification.requesterUsername)}>수락</Button>
                <Button onClick={() => handleRespondToRequest(notification.id, notification.requesterId, notification.recipientId, 'REJECTED', notification.requesterUsername)}>거절</Button>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {modalMessage}
          </Typography>
          <Button onClick={() => setModalOpen(false)}>닫기</Button>
        </Box>
      </Modal>
    </div>
  );
};
