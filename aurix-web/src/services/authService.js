import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    localStorage.removeItem('aurix_token');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async requestPasswordReset(email) {
    const response = await api.post('/auth/password-reset', { email });
    return response.data;
  },

  async verifyMFA(token, code) {
    const response = await api.post('/mfa/validar-token', {
      codigoToken: token,
      codigoInformado: code,
    });
    return response.data;
  },
};

export default authService;
