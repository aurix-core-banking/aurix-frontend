import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const API_BASE_URL = 'http://localhost:8080/api';

const obterMensagemErro = (error) => {
  const status = error.response?.status;
  if (status === 401) return 'CPF ou senha inválidos';
  if (status === 423) return 'Conta bloqueada. Entre em contato com o suporte';
  return error.response?.data?.message || error.message || 'Falha na autenticação';
};

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

      const data = response.data;

      if (data?.mfaRequired || data?.mfaObrigatorio) {
        return { mfaRequired: true, codigoToken: data.codigoToken };
      }

      const { token, refreshToken, user } = data;

      await this.storeToken(token);
      if (refreshToken) await this.storeRefreshToken(refreshToken);
      await this.storeUser(user);

      this.token = token;
      this.user = user;

      return { token, user };
    } catch (error) {
      throw new Error(obterMensagemErro(error));
    }
  }

  async validarTokenMFA(codigoToken, codigoInformado) {
    try {
      const response = await axios.post(`${API_BASE_URL}/mfa/validar-token`, {
        codigoToken,
        codigoInformado,
      });

      const { token, refreshToken, user } = response.data;

      await this.storeToken(token);
      if (refreshToken) await this.storeRefreshToken(refreshToken);
      await this.storeUser(user);

      this.token = token;
      this.user = user;

      return { token, user };
    } catch (error) {
      throw new Error(obterMensagemErro(error));
    }
  }

  async gerarTokenMFA(cpf) {
    try {
      const response = await axios.post(`${API_BASE_URL}/mfa/gerar-token`, {
        cpf: cpf?.replace(/\D/g, ''),
      });
      return response.data;
    } catch (error) {
      throw new Error(obterMensagemErro(error));
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

  async storeRefreshToken(refreshToken) {
    await EncryptedStorage.setItem('aurix_refresh_token', refreshToken);
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
    await EncryptedStorage.removeItem('aurix_refresh_token');
    await AsyncStorage.removeItem('aurix_user');
    this.token = null;
    this.user = null;
  }

  async clearStoredToken() {
    await EncryptedStorage.removeItem('aurix_token');
    await EncryptedStorage.removeItem('aurix_refresh_token');
    this.token = null;
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

  async forgotPassword(cpf) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        cpf: cpf?.replace(/\D/g, ''),
      });
      return response.data;
    } catch (error) {
      throw new Error(obterMensagemErro(error));
    }
  }

  async resetPassword(cpf, codigo, novaSenha) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        cpf: cpf?.replace(/\D/g, ''),
        codigo,
        novaSenha,
      });
      return response.data;
    } catch (error) {
      throw new Error(obterMensagemErro(error));
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(obterMensagemErro(error));
    }
  }
}

export const authService = new AuthService();

export default authService;
