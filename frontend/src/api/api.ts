import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend URL
const API_BASE_URL = 'http://172.20.10.2:5000/auth';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically add JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default api;
