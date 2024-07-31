import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axiosInstance from '../utils/axiosInstance';
import {addMessage, fetchChatRooms} from '../redux/chatSlice.js';

let stompClient = null;

export const connect = (onMessageReceived, chatRoomId, dispatch, userId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in localStorage');
    return;
  }

  const socketUrl = `http://localhost:8080/ws?token=${token}`;
  const socket = new SockJS(socketUrl);

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: (frame) => {
      console.log('Connected to WebSocket');

      stompClient.publish({
        destination: '/app/initialConnect',
        body: JSON.stringify({ token: `Bearer ${token}` })
      });

      stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          dispatch(addMessage(parsedMessage)); // Redux 상태 업데이트
          onMessageReceived(parsedMessage);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });

      // 친구 요청 알림을 위한 구독
      stompClient.subscribe(`/topic/friendRequests/${userId}`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          if (notification.type === 'friendRequestAccepted') {
            dispatch(fetchChatRooms(userId)); // 친구 요청 수락 시 채팅방 목록 갱신
            onMessageReceived(notification);
          }
        } catch (e) {
          console.error('Error parsing friend request notification:', e);
        }
      });
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    },
    onWebSocketClose: () => {
      console.log('WebSocket closed. Attempting to reconnect...');
      setTimeout(() => stompClient.activate(), 5000);
    },
    onWebSocketError: (error) => {
      console.error('WebSocket error: ', error);
    }
  });

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
  }
};

export const sendMessage = async (message) => {
  try {
    const response = await axiosInstance.post('/messages', message);
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(response.data)
      });
    } else {
      console.error('Stomp client is not connected');
    }
  } catch (error) {
    console.error('Failed to save message:', error);
  }
};
