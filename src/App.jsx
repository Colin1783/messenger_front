import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {LoginPage} from "./pages/LoginPage.jsx";
import {RegisterPage} from "./pages/RegisterPage.jsx";
import {Home} from "./pages/Home.jsx";
import {MainPage} from "./pages/MainPage.jsx";
import {ChatContainer} from "./pages/ChatContainer.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import {SettingsPage} from "./pages/SettingsPage.jsx";
import {login, logout} from './redux/authSlice';
import {connect, disconnect} from "./app/websocketService.js";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Component mount 시 localStorage에서 token과 user를 가져와 redux에 설정
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(login({ token, user: parsedUser }));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        dispatch(logout());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("isAuthenticated state changed:", isAuthenticated);
    if (isAuthenticated) {
      connect((message) => {
        console.log('Received message:', message);
      });
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<MainPage />} />
          <Route path="chat" element={<ChatContainer />}>
            <Route path=":id" element={<ChatPage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
