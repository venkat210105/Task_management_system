import api from './axios';

export const fetchSystemStats = () => api.get('/admin/stats').then((r) => r.data);

export const fetchAllUsers = () => api.get('/admin/users').then((r) => r.data);

export const fetchAllTasks = (params) => api.get('/admin/tasks', { params }).then((r) => r.data);
