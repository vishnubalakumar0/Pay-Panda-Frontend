import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: API_URL, timeout: 20000 });

/** Backend JSON responses (and hand-built QR image paths) use a server-relative
 * `/api/...` path, which only resolves correctly when the frontend and API share an
 * origin (the old same-origin dev-proxy setup). Once the frontend is deployed
 * separately (e.g. Vercel) with VITE_API_URL pointing at a different origin, those
 * paths need the `/api` prefix swapped for the real API origin. */
export function assetUrl(path) {
  return path?.startsWith('/api') ? path.replace(/^\/api/, API_URL) : path;
}
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
