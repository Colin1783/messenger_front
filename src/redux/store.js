import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import friendsReducer from './friendsSlice'; // friendsSlice 추가

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    friends: friendsReducer, // friendsReducer 추가
  },
});
