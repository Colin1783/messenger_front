import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // '/api'로 시작하는 모든 요청을 백엔드 서버로 프록시
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request with token:', token); // 로
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with Authorization header:', config); // 로그 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 403 에러 처리
    if (error.response && error.response.status === 403) {
      console.error('Access denied. Possibly due to expired or invalid token.');
    }
    return Promise.reject(error);
  }
);

export default instance;