import React, {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Button, CircularProgress, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {connect, disconnect} from '../app/websocketService';
import {acceptFriendRequest, addFriendRequest, fetchPendingRequests, setFriends} from '../redux/friendsSlice';

export const FriendsListPage = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;
  const friends = useSelector((state) => state.friends.friends);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState('');

  const fetchFriends = async () => {
    if (!userId) return;
    setLoadingFriends(true);
    try {
      const response = await axiosInstance.get(`/friends/${userId}`);
      console.log('Fetched friends:', response.data);
      dispatch(setFriends(response.data));
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
      dispatch(fetchPendingRequests(userId));
    }

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
    setLoadingSearch(true);
    try {
      const response = await axiosInstance.get(`/users/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setLoadingSearch(false);
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
      dispatch(fetchPendingRequests(userId)); // Pending requests 업데이트
      setFriendRequestStatus('친구 요청이 성공적으로 보내졌습니다.');
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setFriendRequestStatus('친구 요청을 보내는 데 실패했습니다.');
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
      {loadingFriends ? (
        <CircularProgress />
      ) : (
        <List>
          {Array.isArray(friends) ? friends.map((friend) => (
            <ListItem key={friend.id}>
              <ListItemText primary={friend.name} secondary={friend.email} />
              <Button onClick={() => handleStartChat(friend.id)} variant="contained" color="primary">채팅하기</Button>
              <Button onClick={() => handleRemoveFriend(friend.id)} variant="contained" color="secondary">삭제</Button>
            </ListItem>
          )) : <p>친구를 추가해 주세요</p>}
        </List>
      )}

      <h2>친구 찾기</h2>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSearch} variant="contained" color="primary" style={{marginTop: '10px'}}>찾기</Button>
      {loadingSearch ? (
        <CircularProgress />
      ) : (
        <List>
          {Array.isArray(searchResults) ? searchResults.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.name} secondary={user.email} />
              {friends.some(friend => friend.id === user.id) ? (
                <Button disabled variant="outlined">추가된 친구</Button>
              ) : pendingRequests.some(request => request.recipientId === user.id || request.requesterId === userId) ? (
                <Button disabled variant="outlined">요청 완료</Button>
              ) : (
                <Button onClick={() => handleSendFriendRequest(user.id)} variant="contained" color="primary">친구 요청</Button>
              )}
            </ListItem>
          )) : <p>존재하지 않는 ID입니다.</p>}
        </List>
      )}
      {friendRequestStatus && <Typography variant="body2" color="textSecondary">{friendRequestStatus}</Typography>}
    </div>
  );
};
