import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Hər sorğuya token əlavə et
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 gəldikdə login-ə yönləndir
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('leo_token');
      localStorage.removeItem('leo_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
