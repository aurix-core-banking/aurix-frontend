import axios from 'axios';
import { instalarInterceptorRefresh } from './refreshTokenInterceptor';

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

instalarInterceptorRefresh(api);

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      cpf: credentials.cpf?.replace(/\D/g, ''),
      senha: credentials.senha,
    });
    const data = response.data;
    if (data?.token) {
      localStorage.setItem('aurix_token', data.token);
      if (data.refreshToken) localStorage.setItem('aurix_refresh_token', data.refreshToken);
    }
    return data;
  },

  async logout() {
    localStorage.removeItem('aurix_token');
    localStorage.removeItem('aurix_refresh_token');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async requestPasswordReset(cpf) {
    const response = await api.post('/auth/forgot-password', { cpf: cpf.replace(/\D/g, '') });
    return response.data;
  },

  async resetPassword(cpf, codigo, novaSenha) {
    const response = await api.post('/auth/reset-password', {
      cpf: cpf.replace(/\D/g, ''),
      codigo,
      novaSenha,
    });
    return response.data;
  },

  async gerarTokenMFA(cpf) {
    const response = await api.post('/mfa/gerar-token', { cpf: cpf.replace(/\D/g, '') });
    return response.data;
  },

  async validarMFA(codigoToken, codigoInformado) {
    const response = await api.post('/mfa/validar-token', {
      codigoToken,
      codigoInformado,
    });
    return response.data;
  },
};

export default authService;
