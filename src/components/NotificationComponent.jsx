import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Badge, Button, IconButton, ListItemText, Menu, MenuItem} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {addNotification} from '../redux/notificationSlice';
import axiosInstance from '../utils/axiosInstance';
import {acceptFriendRequest, setPendingRequests} from '../redux/friendsSlice';

export const NotificationComponent = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);
  const token = localStorage.getItem('token');

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const eventSourceUrl = `http://localhost:8080/friend-requests/notifications?token=${token}`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.addEventListener("notification", function(event) {
      console.log('New notification received:', event.data);
      dispatch(addNotification(JSON.parse(event.data)));
    });

    eventSource.onerror = function(event) {
      console.error('EventSource failed:', event);
      eventSource.close();
    };

    console.log('Subscribed to EventSource for notifications.');

    return () => {
      console.log('Closing EventSource.');
      eventSource.close();
    };
  }, [dispatch, token]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await axiosInstance.post('/friend-requests/respond', {
        requestId,
        status,
      });
      dispatch(setPendingRequests(pendingRequests.filter(request => request.id !== requestId)));
      if (status === 'ACCEPTED') {
        dispatch(acceptFriendRequest({requestId}));
      }
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {notifications.length === 0 ? (
          <MenuItem onClick={handleMenuClose}>No notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index}>
              <ListItemText
                primary={`${notification.requesterUsername}님으로부터 친구 요청이 도착했습니다.`}
              />
              <div>
                <Button
                  onClick={() => handleRespondToRequest(notification.requestId, 'ACCEPTED')}
                >
                  수락
                </Button>
                <Button
                  onClick={() => handleRespondToRequest(notification.requestId, 'REJECTED')}
                >
                  거절
                </Button>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};
