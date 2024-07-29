import {createSlice} from '@reduxjs/toolkit';

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  console.log("Retrieved user from localStorage:", user);
  if (!user) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: getUserFromLocalStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      console.log("User logged in, state updated:", state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("User logged out, state updated:", state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
