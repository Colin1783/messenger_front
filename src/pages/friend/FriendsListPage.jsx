import React, {useEffect, useState} from 'react';
import axiosInstance from '../../utils/axiosInstance.js';
import {Button, CircularProgress, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {connect, disconnect} from '../../app/websocketService.js';
import {acceptFriendRequest, addFriendRequest, fetchPendingRequests, setFriends} from '../../redux/friendsSlice.js';

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
  const [searchError, setSearchError] = useState('');

  const fetchFriends = async () => {
    if (!userId) return;
    setLoadingFriends(true);
    try {
      const response = await axiosInstance.get(`/friends/${userId}`);
      console.log('친구 목록을 가져왔습니다:', response.data);
      dispatch(setFriends(response.data));
    } catch (error) {
      console.error('친구 목록을 가져오는 데 실패했습니다:', error);
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
      console.log('WebSocket으로부터 메시지를 받았습니다:', message);
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
    if (searchQuery.length < 3) {
      setSearchError('검색어는 최소 3글자 이상이어야 합니다.');
      return;
    }

    setLoadingSearch(true);
    setSearchError('');
    try {
      const response = await axiosInstance.get(`/users/search?query=${searchQuery}`);
      const filteredResults = response.data.filter(user => user.id !== userId); // 자신을 제외
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('사용자 검색에 실패했습니다:', error);
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
      console.error('친구 요청을 보내는 데 실패했습니다:', error);
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
      console.error('채팅을 시작하는 데 실패했습니다:', error);
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
      console.error('친구 삭제에 실패했습니다:', error);
    }
  };

  if (!userId) {
    return <p>로딩 중...</p>; // 유저 아이디를 불러올 때까지 로딩 상태 표시
  }

  return (
    <div>
      <h2>친구 목록</h2>
      {loadingFriends ? (
        <CircularProgress />
      ) : (
        <List>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <ListItem key={friend.id}>
                <ListItemText primary={friend.name} secondary={friend.email} />
                <Button onClick={() => handleStartChat(friend.id)} variant="contained" color="primary">채팅하기</Button>
                <Button onClick={() => handleRemoveFriend(friend.id)} variant="contained" color="secondary">삭제</Button>
              </ListItem>
            ))
          ) : (
            <Typography>친구를 추가해 주세요</Typography>
          )}
        </List>
      )}

      <h2>친구 찾기</h2>
      <TextField
        label="검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch} variant="contained" color="primary" style={{ marginTop: '10px' }}>찾기</Button>
      {searchError && <Typography color="error">{searchError}</Typography>}
      {loadingSearch ? (
        <CircularProgress />
      ) : (
        <List>
          {Array.isArray(searchResults) ? searchResults.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.name} secondary={user.email} />
              {friends.some(friend => friend.id === user.id) ? (
                <Button disabled variant="outlined">추가된 친구</Button>
              ) : pendingRequests.some(request => (request.recipientId === user.id && request.requesterId === userId) || (request.recipientId === userId && request.requesterId === user.id)) ? (
                <Button disabled variant="outlined">요청 완료</Button>
              ) : (
                <Button onClick={() => handleSendFriendRequest(user.id)} variant="contained" color="primary">친구 요청</Button>
              )}
            </ListItem>
          )) : <Typography>검색 결과가 없습니다.</Typography>}
        </List>
      )}
      {friendRequestStatus && <Typography variant="body2" color="textSecondary">{friendRequestStatus}</Typography>}
    </div>
  );
};
