import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './Login';

jest.mock('../services/authService', () => ({
  authService: {
    gerarTokenMFA: jest.fn().mockResolvedValue({ codigoToken: 'token-123' }),
    validarMFA: jest.fn().mockResolvedValue({ token: 'new-token', user: { nome: 'Maria' } }),
  },
  __esModule: true,
  default: {
    gerarTokenMFA: jest.fn().mockResolvedValue({}),
    validarMFA: jest.fn().mockResolvedValue({}),
  },
}));

const theme = createTheme();
const mockOnLogin = jest.fn();

function renderLogin() {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Login onLogin={mockOnLogin} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('renderiza formulario de login', () => {
  renderLogin();
  expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^Entrar$/i })).toBeInTheDocument();
});

test('chama onLogin com cpf e senha no submit', async () => {
  mockOnLogin.mockResolvedValue({ success: true });
  renderLogin();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'minhasenha' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalledWith({
      cpf: '123.456.789-00',
      senha: 'minhasenha',
    });
  });
});

test('exibe erro quando credenciais invalidas', async () => {
  mockOnLogin.mockRejectedValue({
    response: { status: 401, data: { message: 'Não autorizado' } },
  });
  renderLogin();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'errada' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  expect(await screen.findByText(/CPF ou senha inválidos/i)).toBeInTheDocument();
});

test('ativa etapa de MFA quando login exige token', async () => {
  mockOnLogin.mockResolvedValue({ mfaRequired: true, codigoToken: 'token-123' });
  renderLogin();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha123' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  expect(await screen.findByText(/Enviamos um código de segurança/i)).toBeInTheDocument();
});

test('valida codigo MFA e chama onLogin com token e user', async () => {
  const { validarMFA } = require('../services/authService').authService;
  validarMFA.mockResolvedValue({ token: 'new-token', user: { nome: 'Maria' } });
  mockOnLogin.mockResolvedValue({ mfaRequired: true, codigoToken: 'token-123' });
  renderLogin();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha123' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  expect(await screen.findByText(/Enviamos um código de segurança/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Código de segurança/i), { target: { value: '654321' } });
  fireEvent.click(screen.getByRole('button', { name: /Validar código/i }));
  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalledWith({ token: 'new-token', user: { nome: 'Maria' } });
  });
});

test('renderiza link de cadastro', () => {
  renderLogin();
  expect(screen.getByText(/Primeiro acesso/i)).toBeInTheDocument();
});

test('renderiza link de esqueci senha', () => {
  renderLogin();
  expect(screen.getByText(/Esqueci minha senha/i)).toBeInTheDocument();
});
