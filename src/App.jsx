import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {LoginPage} from './LoginPage';
import {Home} from './Home';
import {MainPage} from './MainPage';
import {ChatContainer} from './ChatContainer';
import {ChatPage} from './ChatPage';
import {SettingsPage} from './SettingsPage';
import {RegisterPage} from './RegisterPage';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
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
