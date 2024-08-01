import React, {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Button, List, ListItem, ListItemText, TextField} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {connect, disconnect} from '../app/websocketService';
import {acceptFriendRequest, addFriendRequest, setFriends} from '../redux/friendsSlice';

export const FriendsListPage = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;
  const friends = useSelector((state) => state.friends.friends);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFriends = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/friends/${userId}`);
      console.log('Fetched friends:', response.data);
      dispatch(setFriends(response.data));
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();

    const onMessageReceived = (message) => {
      console.log('Message received from WebSocket:', message);
      if (message.type === 'friendRequest') {
        dispatch(addFriendRequest(message));
      } else if (message.type === 'friendRequestAccepted') {
        dispatch(acceptFriendRequest(message));
        fetchFriends();
      }
    };

    connect(onMessageReceived);

    return () => {
      disconnect();
    };
  }, [userId, dispatch]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/users/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleSendFriendRequest = async (recipientId) => {
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
