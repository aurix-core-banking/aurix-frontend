import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Login with credentials
  async login(credentials) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response
      const response = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          nome: credentials.nome || 'João Silva',
          email: credentials.email || 'joao.silva@aurix.com.br',
          cpf: credentials.cpf,
          telefone: '(11) 99999-9999',
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
          },
          conta: {
            numero: '12345-6',
            agencia: '0001',
            saldo: 15750.50,
            limite: 5000.00
          }
        }
      };

      // Store token securely
      await this.storeToken(response.token);
      await this.storeUser(response.user);

      this.token = response.token;
      this.user = response.user;

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Falha na autenticação');
    }
  }

  // Biometric login
  async biometricLogin() {
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored user data
      const userData = await this.getStoredUser();
      if (!userData) {
        throw new Error('Nenhum usuário encontrado');
      }

      // Generate new token
      const token = 'mock_jwt_token_' + Date.now();
      await this.storeToken(token);

      this.token = token;
      this.user = userData;

      return { token, user: userData };
    } catch (error) {
      console.error('Biometric login error:', error);
      throw new Error('Falha na autenticação biométrica');
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      if (this.user) {
        return this.user;
      }

      const user = await this.getStoredUser();
      if (user) {
        this.user = user;
        return user;
      }

      throw new Error('Usuário não autenticado');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Get stored token
  async getStoredToken() {
    try {
      if (this.token) {
        return this.token;
      }

      const token = await EncryptedStorage.getItem('aurix_token');
      if (token) {
        this.token = token;
        return token;
      }

      return null;
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }

  // Store token securely
  async storeToken(token) {
    try {
      await EncryptedStorage.setItem('aurix_token', token);
      this.token = token;
    } catch (error) {
      console.error('Store token error:', error);
      throw error;
    }
  }

  // Store user data
  async storeUser(user) {
    try {
      await AsyncStorage.setItem('aurix_user', JSON.stringify(user));
      this.user = user;
    } catch (error) {
      console.error('Store user error:', error);
      throw error;
    }
  }

  // Get stored user
  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('aurix_user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      // Clear stored data
      await EncryptedStorage.removeItem('aurix_token');
      await AsyncStorage.removeItem('aurix_user');

      // Clear memory
      this.token = null;
      this.user = null;

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await this.getStoredToken();
      const user = await this.getStoredUser();
      
      return !!(token && user);
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 500));

      const newToken = 'mock_refreshed_token_' + Date.now();
      await this.storeToken(newToken);

      return newToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Validate token
  async validateToken() {
    try {
      const token = await this.getStoredToken();
      if (!token) {
        return false;
      }

      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock validation - in real app, call API
      return true;
    } catch (error) {
      console.error('Validate token error:', error);
      return false;
    }
  }

  // Clear stored token
  async clearStoredToken() {
    try {
      await EncryptedStorage.removeItem('aurix_token');
      this.token = null;
    } catch (error) {
      console.error('Clear stored token error:', error);
    }
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update stored user
      const updatedUser = { ...this.user, ...profileData };
      await this.storeUser(updatedUser);

      this.user = updatedUser;
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (currentPassword !== '123456') {
        throw new Error('Senha atual incorreta');
      }

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
