import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import chatReducer from './chatSlice';
import friendsReducer from './friendsSlice'; // friendsSlice 추가
import notificationReducer from './notificationSlice'; // Import notificationSlice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    friends: friendsReducer, // friendsReducer 추가
    notifications: notificationReducer, // Add notificationSlice to the store
  },
});
