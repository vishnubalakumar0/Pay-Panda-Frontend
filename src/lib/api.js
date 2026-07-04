import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 20000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('pay_panda_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !location.pathname.startsWith('/pay/')) {
    localStorage.removeItem('pay_panda_token');
    window.dispatchEvent(new CustomEvent('pay-panda:auth-expired'));
  }
  return Promise.reject(error);
});

export default api;
