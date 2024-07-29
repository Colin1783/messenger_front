import axios from 'axios';

const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옵니다

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export default axiosInstance;
