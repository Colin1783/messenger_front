import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const initialState = {
  pendingRequests: [],
  friends: [],
  notifications: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
    addFriendRequest: (state, action) => {
      state.pendingRequests.push(action.payload);
    },
    acceptFriendRequest: (state, action) => {
      const { requesterId } = action.payload;
      state.pendingRequests = state.pendingRequests.filter(request => request.requesterId !== requesterId);
      state.friends.push(action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { setFriends, setPendingRequests, addFriendRequest, acceptFriendRequest, addNotification } = friendsSlice.actions;

export const fetchPendingRequests = (userId) => async (dispatch) => {
  try {
    console.log('Fetching pending requests for userId:', userId);
    const response = await axiosInstance.get(`/friend-requests/pending/${userId}`);
    console.log('Fetched pending requests:', response.data);
    dispatch(setPendingRequests(response.data));
  } catch (error) {
    console.error('Failed to fetch pending requests:', error);
  }
};

export default friendsSlice.reducer;
