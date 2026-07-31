import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        cpf: credentials.cpf?.replace(/\D/g, ''),
        senha: credentials.senha,
      });

      const { token, user } = response.data;

      await this.storeToken(token);
      await this.storeUser(user);

      this.token = token;
      this.user = user;

      return { token, user };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('CPF ou senha inválidos');
      }
      throw new Error('Falha na autenticação');
    }
  }

  async biometricLogin() {
    try {
      const userData = await this.getStoredUser();
      if (!userData) {
        throw new Error('Nenhum usuário encontrado');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${await this.getStoredToken()}` },
      });

      const { token } = response.data;
      await this.storeToken(token);
      this.token = token;
      this.user = userData;

      return { token, user: userData };
    } catch (error) {
      throw new Error('Falha na autenticação biométrica');
    }
  }

  async getCurrentUser() {
    try {
      if (this.user) return this.user;
      const user = await this.getStoredUser();
      if (user) {
        this.user = user;
        return user;
      }
      throw new Error('Usuário não autenticado');
    } catch (error) {
      throw error;
    }
  }

  async getStoredToken() {
    try {
      if (this.token) return this.token;
      const token = await EncryptedStorage.getItem('aurix_token');
      if (token) {
        this.token = token;
        return token;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async storeToken(token) {
    await EncryptedStorage.setItem('aurix_token', token);
    this.token = token;
  }

  async storeUser(user) {
    await AsyncStorage.setItem('aurix_user', JSON.stringify(user));
    this.user = user;
  }

  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('aurix_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    await EncryptedStorage.removeItem('aurix_token');
    await AsyncStorage.removeItem('aurix_user');
    this.token = null;
    this.user = null;
  }

  async isAuthenticated() {
    const token = await this.getStoredToken();
    const user = await this.getStoredUser();
    return !!(token && user);
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const newToken = response.data.token;
      await this.storeToken(newToken);
      return newToken;
    } catch (error) {
      throw new Error('Falha ao renovar token');
    }
  }
}

export default new AuthService();