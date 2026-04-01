import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (nombre, email, password) => api.post('/auth/register', { nombre, email, password });
export const socialLogin = (provider, email, nombre) =>
  api.post('/auth/social-login', { provider, email, nombre });

export const verifyToken = () => api.get('/auth/verify');
export const logout = () => api.post('/auth/logout');
