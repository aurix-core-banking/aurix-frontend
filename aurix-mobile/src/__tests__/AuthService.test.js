import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080/api';

let mock;

beforeEach(() => {
  mock = new MockAdapter(axios);
  jest.clearAllMocks();
});

afterEach(() => {
  mock.restore();
});

describe('AuthService', () => {
  test('login retorna token e usuario no sucesso', async () => {
    mock.onPost(`${API_BASE_URL}/auth/login`).reply(200, {
      token: 'token-1',
      refreshToken: 'refresh-1',
      user: { nome: 'Maria' },
    });

    const resultado = await authService.login({ cpf: '12345678901', senha: '123' });
    expect(resultado.token).toBe('token-1');
    expect(resultado.user.nome).toBe('Maria');
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith('aurix_token', 'token-1');
  });

  test('login com credenciais invalidas lanca erro', async () => {
    mock.onPost(`${API_BASE_URL}/auth/login`).reply(401, { message: 'Não autorizado' });

    await expect(authService.login({ cpf: '12345678901', senha: 'errada' })).rejects.toThrow(
      'CPF ou senha inválidos'
    );
  });

  test('login que exige MFA retorna mfaRequired', async () => {
    mock.onPost(`${API_BASE_URL}/auth/login`).reply(200, {
      mfaRequired: true,
      codigoToken: 'tok-1',
    });

    const resultado = await authService.login({ cpf: '12345678901', senha: '123' });
    expect(resultado.mfaRequired).toBe(true);
    expect(EncryptedStorage.setItem).not.toHaveBeenCalled();
  });

  test('gerarTokenMFA envia POST para /mfa/gerar-token', async () => {
    mock.onPost(`${API_BASE_URL}/mfa/gerar-token`).reply(200, { codigoToken: 'tok-1' });

    const resultado = await authService.gerarTokenMFA('12345678901');
    expect(resultado.codigoToken).toBe('tok-1');
  });

  test('validarTokenMFA retorna token e usuario', async () => {
    mock.onPost(`${API_BASE_URL}/mfa/validar-token`).reply(200, {
      token: 'token-final',
      refreshToken: 'refresh-final',
      user: { nome: 'Maria' },
    });

    const resultado = await authService.validarTokenMFA('tok-1', '654321');
    expect(resultado.token).toBe('token-final');
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith('aurix_token', 'token-final');
  });

  test('forgotPassword envia POST para /auth/forgot-password', async () => {
    mock.onPost(`${API_BASE_URL}/auth/forgot-password`).reply(201, { message: 'Enviado' });

    const resultado = await authService.forgotPassword('12345678901');
    expect(resultado.message).toBe('Enviado');
  });

  test('resetPassword envia POST para /auth/reset-password', async () => {
    mock.onPost(`${API_BASE_URL}/auth/reset-password`).reply(201, { message: 'Redefinida' });

    const resultado = await authService.resetPassword('12345678901', 'ABC', 'novaSenha123');
    expect(resultado.message).toBe('Redefinida');
  });

  test('register envia POST para /auth/register', async () => {
    mock.onPost(`${API_BASE_URL}/auth/register`).reply(201, { id: '1' });

    const resultado = await authService.register({
      cpf: '12345678901',
      nome: 'Maria',
      email: 'maria@test.com',
      senha: 'senha123',
    });
    expect(resultado.id).toBe('1');
  });
});
