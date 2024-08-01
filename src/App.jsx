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
import {FriendsListPage} from "./pages/FriendsListPage.jsx"; // Import FriendsListPage
import {logout} from './redux/authSlice.js';
import {connect, disconnect} from "./app/websocketService.js";
import {NotificationComponent} from "./components/NotificationComponent.jsx";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
          <Route path="friends" element={<FriendsListPage />} /> {/* Add FriendsListPage route */}
        </Route>
      </Routes>
      {isAuthenticated && <NotificationComponent />} {/* Add NotificationComponent here */}
    </Router>
  );
};

export default App;
