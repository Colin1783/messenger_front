import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from '../../utils/axiosInstance';

export const BoardListPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/board')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      <h1>게시판</h1>
      <Link to="/board/new">새 글 작성</Link>
      {posts.map(post => (
        <div key={post.id}>
          <Link to={`/board/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
        </div>
      ))}
    </div>
  );
};


