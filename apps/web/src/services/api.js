// apps/web/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token from localStorage
api.interceptors.request.use((config) => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('agrochain_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auth Services
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Trade Services
export const createTrade = async (tradeData) => {
    try {
        const response = await api.post('/trade/create', tradeData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const agreeTrade = async (tradeId) => {
    try {
        const response = await api.post(`/trade/${tradeId}/agree`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const assignTransporter = async (tradeId, transporterPhone) => {
    try {
        const response = await api.post(`/trade/${tradeId}/assign-transporter`, { transporterPhone });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markPickedUp = async (tradeId) => {
    try {
        const response = await api.post(`/trade/${tradeId}/pickup`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markDelivered = async (tradeId) => {
    try {
        const response = await api.post(`/trade/${tradeId}/deliver`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const completeTrade = async (tradeId) => {
    try {
        const response = await api.post(`/trade/${tradeId}/complete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMyTrades = async () => {
    try {
        const response = await api.get('/trade/my/all');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMarketplace = async () => {
    try {
        const response = await api.get('/trade/marketplace');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const bidOnTrade = async (tradeId, bidData) => {
    try {
        const response = await api.post(`/trade/${tradeId}/bid`, bidData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Payment Services
export const createPaymentOrder = async (tradeId, amount) => {
    try {
        const response = await api.post('/payment/create-order', { tradeId, amount });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;
