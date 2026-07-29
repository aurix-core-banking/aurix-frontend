jest.mock('axios');
import axios from 'axios';
import auth from './authService';

beforeEach(() => {
  localStorage.setItem('aurix_token', 'test-token');
});
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('login envia POST para /auth/login', async () => {
  axios.post.mockResolvedValue({ data: { token: 'new-token', user: { nome: 'Maria' } } });
  const result = await auth.login({ cpf: '12345678901', senha: '123' });
  expect(axios.post).toHaveBeenCalledWith('/auth/login', { cpf: '12345678901', senha: '123' }, expect.any(Object));
  expect(result.data.token).toBe('new-token');
});

test('getCurrentUser envia GET para /auth/me', async () => {
  axios.get.mockResolvedValue({ data: { nome: 'Maria' } });
  const result = await auth.getCurrentUser();
  expect(axios.get).toHaveBeenCalledWith('/auth/me', expect.any(Object));
  expect(result.data.nome).toBe('Maria');
});

test('logout limpa token do localStorage', () => {
  auth.logout();
  expect(localStorage.getItem('aurix_token')).toBeNull();
});

test('register envia POST para /auth/register', async () => {
  axios.post.mockResolvedValue({ data: { id: '1' } });
  await auth.register({ nome: 'Maria', email: 'maria@test.com' });
  expect(axios.post).toHaveBeenCalledWith('/auth/register', { nome: 'Maria', email: 'maria@test.com' }, expect.any(Object));
});

test('requestPasswordReset envia POST para /auth/password-reset', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Email enviado' } });
  await auth.requestPasswordReset('maria@test.com');
  expect(axios.post).toHaveBeenCalledWith('/auth/password-reset', { email: 'maria@test.com' }, expect.any(Object));
});
