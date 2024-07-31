import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// 비동기 Thunk 액션
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chatrooms/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteChatRoom = createAsyncThunk(
  'chat/deleteChatRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chatrooms/${roomId}`);
      return roomId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatRooms: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.chatRooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChatRoom.fulfilled, (state, action) => {
        state.chatRooms = state.chatRooms.filter(room => room.id !== action.payload);
      })
      .addCase(deleteChatRoom.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
