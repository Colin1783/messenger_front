import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axiosInstance from '../utils/axiosInstance';

let stompClient = null;

export const connect = (onMessageReceived, chatRoomId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in localStorage');
    return;
  }

  console.log('Connecting to WebSocket with chatRoomId:', chatRoomId);

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

      // 초기 메시지 전송
      stompClient.publish({
        destination: '/app/initialConnect',
        body: JSON.stringify({ token: `Bearer ${token}` })
      });

      // 특정 채팅방 구독
      const topic = `/topic/chat/${chatRoomId}`;
      console.log('Subscribing to topic:', topic);
      stompClient.subscribe(topic, (message) => {
        console.log('Message received from WebSocket:', message);
        try {
          onMessageReceived(JSON.parse(message.body));
        } catch (e) {
          console.error('Error parsing message:', e);
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
  if (stompClient && stompClient.connected) {
    // HTTP POST 요청을 통해 메시지를 서버에 저장
    try {
      await axiosInstance.post('/messages', {
        chatRoomId: message.chatRoomId,
        senderId: message.senderId,
        content: message.content,
        username: message.username,
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    // WebSocket을 통해 메시지를 전송
    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
    console.log('Message sent:', message);
  } else {
    console.error('Stomp client is not connected');
  }
};
