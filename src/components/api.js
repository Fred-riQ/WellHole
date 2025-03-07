import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

// Room services
export const roomService = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  
  getRoomById: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  }
};

// Special offers services
export const offerService = {
  getAllOffers: async () => {
    const response = await api.get('/special-offers');
    return response.data;
  }
};

// About us services
export const aboutService = {
  getAboutContent: async () => {
    const response = await api.get('/about');
    return response.data;
  }
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  
  cancelBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};

// Payment services
export const paymentService = {
  processMpesaPayment: async (paymentData) => {
    const response = await api.post('/payments/mpesa', paymentData);
    return response.data;
  }
};

export default {
  auth: authService,
  rooms: roomService,
  offers: offerService,
  about: aboutService,
  bookings: bookingService,
  payments: paymentService
};