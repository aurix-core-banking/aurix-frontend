jest.mock('./services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
  __esModule: true,
  default: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { authService } from './services/authService';
import App from './App';

function renderApp() {
  return render(<BrowserRouter><App /></BrowserRouter>);
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('renderiza Login quando nao autenticado', () => {
  authService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
  renderApp();
  expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
});

test('renderiza Dashboard apos autenticacao', async () => {
  localStorage.setItem('aurix_token', 'test_token');
  authService.getCurrentUser.mockResolvedValue({ nome: 'Maria Silva', email: 'maria@test.com' });
  renderApp();
  expect(await screen.findByText(/AUREUS Suite/i)).toBeInTheDocument();
});

test('login bem sucedido redireciona para Dashboard', async () => {
  authService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
  authService.login.mockResolvedValue({ token: 'new-token', user: { nome: 'Maria' } });
  renderApp();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha123' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  expect(await screen.findByText(/AUREUS Suite/i, {}, { timeout: 4000 })).toBeInTheDocument();
});


test('login falho mostra erro', async () => {
  authService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
  authService.login.mockRejectedValue(new Error('Credenciais invalidas'));
  renderApp();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'errada' } });
  fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
  expect(await screen.findByText(/Erro no login/i, {}, { timeout: 4000 })).toBeInTheDocument();
});




test('logout redireciona para Login', async () => {
  localStorage.setItem('aurix_token', 'test_token');
  authService.getCurrentUser.mockResolvedValue({ nome: 'Maria Silva', email: 'maria@test.com' });
  renderApp();
  expect(await screen.findByText(/AUREUS Suite/i)).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('user-profile'));
  fireEvent.click(screen.getByText(/Sair da Conta/i));
  expect(await screen.findByLabelText(/CPF/i)).toBeInTheDocument();
});


