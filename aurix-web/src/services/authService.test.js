jest.mock('axios', () => {
  const mockPost = jest.fn();
  const mockGet = jest.fn();

  const mockAxios = {
    post: mockPost,
    get: mockGet,
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };
  return mockAxios;
});

import axios from 'axios';
import auth from './authService';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('login envia POST para /auth/login', async () => {
  axios.post.mockResolvedValue({ data: { token: 'new-token', user: { nome: 'Maria' } } });
  const result = await auth.login({ cpf: '12345678901', senha: '123' });
  expect(axios.post).toHaveBeenCalledWith('/auth/login', { cpf: '12345678901', senha: '123' });
  expect(result.token).toBe('new-token');
  expect(localStorage.getItem('aurix_token')).toBe('new-token');
});

test('login armazena refresh token quando retornado', async () => {
  axios.post.mockResolvedValue({
    data: { token: 'new-token', refreshToken: 'refresh-1', user: { nome: 'Maria' } },
  });
  await auth.login({ cpf: '12345678901', senha: '123' });
  expect(localStorage.getItem('aurix_refresh_token')).toBe('refresh-1');
});

test('login sem token retorna mfaRequired quando solicitado', async () => {
  axios.post.mockResolvedValue({ data: { mfaRequired: true, codigoToken: 'token-1' } });
  const result = await auth.login({ cpf: '12345678901', senha: '123' });
  expect(result.mfaRequired).toBe(true);
  expect(localStorage.getItem('aurix_token')).toBeNull();
});

test('getCurrentUser envia GET para /auth/me', async () => {
  axios.get.mockResolvedValue({ data: { nome: 'Maria' } });
  const result = await auth.getCurrentUser();
  expect(axios.get).toHaveBeenCalledWith('/auth/me');
  expect(result.nome).toBe('Maria');
});

test('logout limpa tokens do localStorage', () => {
  localStorage.setItem('aurix_token', 't');
  localStorage.setItem('aurix_refresh_token', 'r');
  auth.logout();
  expect(localStorage.getItem('aurix_token')).toBeNull();
  expect(localStorage.getItem('aurix_refresh_token')).toBeNull();
});

test('register envia POST para /auth/register', async () => {
  axios.post.mockResolvedValue({ data: { id: '1' } });
  await auth.register({ nome: 'Maria', email: 'maria@test.com' });
  expect(axios.post).toHaveBeenCalledWith('/auth/register', { nome: 'Maria', email: 'maria@test.com' });
});

test('requestPasswordReset envia POST para /auth/forgot-password', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Email enviado' } });
  await auth.requestPasswordReset('12345678901');
  expect(axios.post).toHaveBeenCalledWith('/auth/forgot-password', { cpf: '12345678901' });
});

test('resetPassword envia POST para /auth/reset-password', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Senha redefinida' } });
  await auth.resetPassword('12345678901', 'ABC123', 'novaSenha123');
  expect(axios.post).toHaveBeenCalledWith('/auth/reset-password', {
    cpf: '12345678901',
    codigo: 'ABC123',
    novaSenha: 'novaSenha123',
  });
});

test('gerarTokenMFA envia POST para /mfa/gerar-token', async () => {
  axios.post.mockResolvedValue({ data: { codigoToken: 't1' } });
  const result = await auth.gerarTokenMFA('12345678901');
  expect(axios.post).toHaveBeenCalledWith('/mfa/gerar-token', { cpf: '12345678901' });
  expect(result.codigoToken).toBe('t1');
});

test('validarMFA envia POST para /mfa/validar-token', async () => {
  axios.post.mockResolvedValue({ data: { token: 't', user: { nome: 'Maria' } } });
  await auth.validarMFA('tok-1', '654321');
  expect(axios.post).toHaveBeenCalledWith('/mfa/validar-token', {
    codigoToken: 'tok-1',
    codigoInformado: '654321',
  });
});
