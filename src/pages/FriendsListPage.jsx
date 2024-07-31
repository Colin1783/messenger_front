import React, {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Button, List, ListItem, ListItemText, TextField} from '@mui/material';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {connect, disconnect} from '../app/websocketService';

export const FriendsListPage = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFriends = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/friends/${userId}`);
      console.log('Friends API response:', response.data);
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/friend-requests/pending/${userId}`);
      console.log('Pending Requests API response:', response.data);
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();

    const onMessageReceived = (message) => {
      console.log('Received message:', message);
      if (message.type === 'friendRequest' || message.type === 'friendRequestAccepted') {
        fetchPendingRequests();
        fetchFriends();
      }
    };

    connect(onMessageReceived, null); // chatRoomId를 사용하지 않음

    return () => {
      disconnect();
    };
  }, [userId]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/users/search?query=${searchQuery}`);
      console.log('Search API response:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleSendFriendRequest = async (recipientId) => {
    console.log('Sending friend request:', { requesterId: userId, recipientId });
    try {
      await axiosInstance.post('/friend-requests/send', null, {
        params: {
          requesterId: userId,
          recipientId,
        },
      });
      alert('Friend request sent!');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    console.log('Responding to friend request:', { requestId, status });
    try {
      await axiosInstance.post('/friend-requests/respond', {
        requestId,
        status,
      });
      setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
      if (status === 'ACCEPTED') {
        fetchFriends();
      }
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
    }
  };

  const handleStartChat = async (friendId) => {
    try {
      const response = await axiosInstance.post('/chatrooms/start-chat', null, {
        params: {
          userId,
          friendId,
        },
      });
      const chatRoomId = response.data.id;
      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axiosInstance.post('/friends/remove', {
        userId,
        friendId,
      });
      fetchFriends();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  console.log('Friends state:', friends);

  if (!userId) {
    return <p>Loading...</p>; // 유저 아이디를 불러올 때까지 Loading 상태 표시
  }

  return (
    <div>
      <h2>친구 목록</h2>
      <List>
        {Array.isArray(friends) ? friends.map((friend) => (
          <ListItem key={friend.id}>
            <ListItemText primary={friend.name} secondary={friend.email} />
            <Button onClick={() => handleStartChat(friend.id)}>채팅하기</Button>
            <Button onClick={() => handleRemoveFriend(friend.id)}>삭제</Button>
          </ListItem>
        )) : <p>친구를 추가해 주세요</p>}
      </List>

      <h2>친구 요청</h2>
      <List>
        {Array.isArray(pendingRequests) ? pendingRequests.map((request) => (
          <ListItem key={request.id}>
            <ListItemText primary={`${request.requesterUsername}님으로부터 친구 요청이 도착했습니다.`} />
            <Button onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}>수락</Button>
            <Button onClick={() => handleRespondToRequest(request.id, 'REJECTED')}>거절</Button>
          </ListItem>
        )) : <p>받은 친구 요청이 없습니다.</p>}
      </List>

      <h2>친구 찾기</h2>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>찾기</Button>
      <List>
        {Array.isArray(searchResults) ? searchResults.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} secondary={user.email} />
            {friends.some(friend => friend.id === user.id) ? (
              <Button disabled>추가된 친구</Button>
            ) : (
              <Button onClick={() => handleSendFriendRequest(user.id)}>친구 요청</Button>
            )}
          </ListItem>
        )) : <p>존재하지 않는 ID입니다.</p>}
      </List>
    </div>
  );
};
