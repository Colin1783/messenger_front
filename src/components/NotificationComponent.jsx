import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Badge, IconButton} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {addNotification} from '../redux/notificationSlice';

export const NotificationComponent = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const token = localStorage.getItem('token');

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

  return (
    <IconButton color="inherit">
      <Badge badgeContent={notifications.length} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};
