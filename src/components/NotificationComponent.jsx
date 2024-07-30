import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {disconnect} from "../app/websocketService.js";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    connect((message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    });

    return () => {
      disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
