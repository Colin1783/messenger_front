// src/pages/ChatListPage.jsx
import React from 'react';
import {Link} from 'react-router-dom';

export const ChatListPage = () => {
  return (
    <div>
      <h1>Chat List</h1>
      <ul>
        <li><Link to="/chat/1">Chat 1</Link></li>
        <li><Link to="/chat/2">Chat 2</Link></li>
      </ul>
    </div>
  );
};
