import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axiosInstance from '../utils/axiosInstance';

let stompClient = null;

export const connect = (onMessageReceived, chatRoomId) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userId = user ? user.id : null;

  if (!token) {
    console.error('No token found in localStorage');
    return;
  }

  if (!chatRoomId) {
    console.error('No chatRoomId provided');
    return;
  }

  const socketUrl = `http://localhost:8080/ws?token=${token}`;
  const socket = new SockJS(socketUrl);

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      console.log(str);
    },
    onConnect: (frame) => {
      console.log('Connected to WebSocket');
      console.log('Connected with headers:', frame.headers);

      stompClient.publish({
        destination: '/app/initialConnect',
        body: JSON.stringify({ token: `Bearer ${token}` })
      });

      stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
        console.log('Message received from WebSocket:', message);
        try {
          onMessageReceived(JSON.parse(message.body));
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });

      // 친구 요청 알림을 위한 구독
      stompClient.subscribe(`/topic/friendRequests/${userId}`, (message) => {
        console.log('Friend request notification received:', message);
        try {
          const notification = JSON.parse(message.body);
          if (notification.type === 'friendRequestAccepted') {
            onMessageReceived(notification);
          }
        } catch (e) {
          console.error('Error parsing friend request notification:', e);
        }
      });
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
    onWebSocketClose: (evt) => {
      console.log('WebSocket closed. Attempting to reconnect...');
      setTimeout(() => stompClient.activate(), 5000);
    },
    onWebSocketError: (error) => {
      console.error('WebSocket error: ', error);
    }
  });

  console.log('Attempting to connect to WebSocket with token: ' + token);
  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
  } else {
    console.log('No active WebSocket connection to disconnect');
  }
};

export const sendMessage = async (message) => {
  console.log('Message data before sending:', message);  // 메시지 데이터 로그 추가
  try {
    const response = await axiosInstance.post('/messages', message);
    console.log('Message saved to server:', response.data);

    if (stompClient && stompClient.connected) {
      console.log('Message data before WebSocket publish:', response.data);  // WebSocket 전송 전 메시지 데이터 로그 추가
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(response.data)
      });
      console.log('Message sent via WebSocket:', response.data);
    } else {
      console.error('Stomp client is not connected');
    }
  } catch (error) {
    console.error('Failed to save message:', error);
  }
};
