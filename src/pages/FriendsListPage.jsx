import React, {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Button, List, ListItem, ListItemText, TextField} from '@mui/material';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

export const FriendsListPage = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get(`/friends/${userId}`);
        console.log('Friends API response:', response.data);
        setFriends(response.data);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get(`/friend-requests/pending/${userId}`);
        console.log('Pending Requests API response:', response.data);
        setPendingRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch pending requests:', error);
      }
    };

    fetchFriends();
    fetchPendingRequests();
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
    try {
      await axiosInstance.post('/friend-requests/respond', {
        requestId,
        status,
      });
      setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
      if (status === 'ACCEPTED') {
        const response = await axiosInstance.get(`/friends/${userId}`);
        setFriends(response.data);
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

  console.log('Friends state:', friends);

  if (!userId) {
    return <p>Loading...</p>; // 유저 아이디를 불러올 때까지 Loading 상태 표시
  }

  return (
    <div>
      <h2>Friends List</h2>
      <List>
        {Array.isArray(friends) ? friends.map((friend) => (
          <ListItem key={friend.id}>
            <ListItemText primary={friend.name} secondary={friend.email} />
            <Button onClick={() => handleStartChat(friend.id)}>Chat</Button>
          </ListItem>
        )) : <p>No friends found</p>}
      </List>

      <h2>Pending Friend Requests</h2>
      <List>
        {Array.isArray(pendingRequests) ? pendingRequests.map((request) => (
          <ListItem key={request.id}>
            <ListItemText primary={`From user ${request.requesterId}`} />
            <Button onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}>Accept</Button>
            <Button onClick={() => handleRespondToRequest(request.id, 'REJECTED')}>Reject</Button>
          </ListItem>
        )) : <p>No pending requests</p>}
      </List>

      <h2>Search Users</h2>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
      <List>
        {Array.isArray(searchResults) ? searchResults.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} secondary={user.email} />
            <Button onClick={() => handleSendFriendRequest(user.id)}>Add Friend</Button>
          </ListItem>
        )) : <p>No users found</p>}
      </List>
    </div>
  );
};
