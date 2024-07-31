import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  pendingRequests: [],
  friends: [],
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
  },
});

export const { setFriends, setPendingRequests, addFriendRequest, acceptFriendRequest } = friendsSlice.actions;
export default friendsSlice.reducer;
