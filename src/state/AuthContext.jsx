import { useEffect, useState } from 'react';
import api from '../lib/api';
import { AuthStore } from './auth-store';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pay_panda_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => logout()).finally(() => setLoading(false));
  }, [token]);
  useEffect(() => {
    const expire = () => logout();
    window.addEventListener('pay-panda:auth-expired', expire);
    return () => window.removeEventListener('pay-panda:auth-expired', expire);
  }, []);
  useEffect(() => {
    if (!token) return;
    const expiresAt = readExpiry(token);
    if (!expiresAt || expiresAt <= Date.now()) { logout(); return; }
    const timer = setTimeout(() => logout(), expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [token]);
  const authenticate = (nextToken, nextUser) => {
    localStorage.setItem('pay_panda_token', nextToken); setToken(nextToken); setUser(nextUser);
  };
  const logout = () => { localStorage.removeItem('pay_panda_token'); setToken(null); setUser(null); };
  return <AuthStore.Provider value={{ token, user, loading, authenticate, logout }}>{children}</AuthStore.Provider>;
}

function readExpiry(token) {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, '=')));
    return Number(payload.exp) * 1000;
  } catch { return 0; }
}
