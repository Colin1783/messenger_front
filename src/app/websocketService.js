import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

let stompClient = null;

export const connect = (onMessageReceived) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in localStorage');
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

      // 초기 메시지 전송
      stompClient.publish({
        destination: '/app/initialConnect',
        body: JSON.stringify({ token: `Bearer ${token}` })
      });

      stompClient.subscribe('/topic/messages', (message) => {
        console.log('Message received from WebSocket:', message);
        onMessageReceived(JSON.parse(message.body));
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

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
    console.log('Message sent:', message);
  } else {
    console.error('Stomp client is not connected');
  }
};
