import {createSlice} from '@reduxjs/toolkit';

// 로컬 스토리지에서 사용자 정보를 가져오는 함수
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  console.log("로컬 스토리지에서 사용자 정보를 가져왔습니다:", user);
  if (!user) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("로컬 스토리지에서 사용자 정보를 파싱하는 데 실패했습니다:", error);
    return null;
  }
};

// 초기 상태 정의
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: getUserFromLocalStorage(),
};

// authSlice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그인 액션
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      console.log("사용자가 로그인했습니다. 상태가 업데이트되었습니다:", state);
    },
    // 로그아웃 액션
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("사용자가 로그아웃했습니다. 상태가 업데이트되었습니다:", state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
