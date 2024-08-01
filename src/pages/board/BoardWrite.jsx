import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from '../../utils/axiosInstance';

export const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/board', { title, content, userId: user.id })
      .then(() => history.push('/board'))
      .catch(error => console.error('Error creating post:', error));
  };

  return (
    <div>
      <h1>새 글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
        />
        <button type="submit">작성</button>
      </form>
    </div>
  );
};