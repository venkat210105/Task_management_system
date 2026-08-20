import api from './axios';

export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data);

export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data);

export const googleAuth = (credential) =>
  api.post('/auth/google', { credential }).then((r) => r.data);

export const fetchMe = () => api.get('/auth/me').then((r) => r.data);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then((r) => r.data);

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password }).then((r) => r.data);
