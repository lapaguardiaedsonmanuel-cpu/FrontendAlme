import api from './api';

export const createOrder = (orderData) => api.post('/orders', orderData);

export const getOrders = () => api.get('/orders');

export const updateOrderStatus = (id, estado) => api.put(`/orders/${id}`, { estado });