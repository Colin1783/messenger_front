import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {LoginPage} from "./pages/LoginPage.jsx";
import {RegisterPage} from "./pages/RegisterPage.jsx";
import {Home} from "./pages/Home.jsx";
import {MainPage} from "./pages/MainPage.jsx";
import {ChatContainer} from "./pages/ChatContainer.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import {SettingsPage} from "./pages/SettingsPage.jsx";


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
