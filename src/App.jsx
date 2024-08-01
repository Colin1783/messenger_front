import React, {useCallback, useEffect} from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {LoginPage} from "./pages/user/LoginPage.jsx";
import {RegisterPage} from "./pages/user/RegisterPage.jsx";
import {Home} from "./pages/Home.jsx";
import {MainPage} from "./pages/MainPage.jsx";
import {ChatContainer} from "./pages/chat/ChatContainer.jsx";
import {Chat} from "./pages/chat/Chat.jsx";
import {SettingsPage} from "./pages/user/SettingsPage.jsx";
import {FriendsListPage} from "./pages/friend/FriendsListPage.jsx";
import {BoardList} from "./pages/board/BoardList.jsx";
import {BoardWrite} from "./pages/board/BoardWrite.jsx";
import BoardDetail from "./pages/board/BoardDetail.jsx";
import BoardEdit from "./pages/board/BoardEdit.jsx"; // 추가된 컴포넌트
import {login, logout} from './redux/authSlice.js';
import {connect, disconnect} from "./app/websocketService.js";
import {NotificationComponent} from "./components/NotificationComponent.jsx";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  let lastHiddenTime = null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      dispatch(login({ token, user }));
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

  useEffect(() => {
    let idleTime = 0;
    let interval;

    const timerIncrement = () => {
      idleTime++;
      if (idleTime > 30) { // 30분 이상 활동이 없으면 로그아웃
        alert('30분 동안 활동이 없어 로그아웃됩니다.');
        dispatch(logout());
      }
    };

    const resetTimer = () => {
      idleTime = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastHiddenTime = new Date();
        clearInterval(interval);
      } else {
        const currentTime = new Date();
        if (lastHiddenTime) {
          const hiddenDuration = (currentTime - lastHiddenTime) / 60000; // minutes
          idleTime += hiddenDuration;
        }
        if (idleTime > 30) {
          alert('30분 동안 활동이 없어 로그아웃됩니다.');
          dispatch(logout());
        } else {
          interval = setInterval(timerIncrement, 60000); // Restart the timer
        }
        lastHiddenTime = null; // Reset last hidden time
      }
    };

    interval = setInterval(timerIncrement, 60000);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 컴포넌트 언마운트 시 이벤트 리스너와 타이머 제거
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/*",
      element: isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace />,
      children: [
        {
          index: true,
          element: <MainPage />,
        },
        {
          path: "chat",
          element: <ChatContainer />,
          children: [
            {
              path: ":id",
              element: <Chat />,
            },
          ],
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "friends",
          element: <FriendsListPage />,
        },
        {
          path: "board",
          element: <BoardList />,
        },
        {
          path: "board/new",
          element: <BoardWrite />,
        },
        {
          path: "board/:id",
          element: <BoardDetail />,
        },
        {
          path: "board/edit/:id",
          element: <BoardEdit />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {isAuthenticated && <NotificationComponent />}
    </>
  );
};

export default App;
