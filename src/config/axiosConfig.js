import axios from 'axios';

export const instance = axios.create({
  baseURL: '/api', // '/api'로 시작하는 모든 요청을 백엔드 서버로 프록시
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

