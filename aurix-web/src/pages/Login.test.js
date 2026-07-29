import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './Login';

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

test('renderiza formulario de login', () => {
  renderLogin();
  expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Acessar/i })).toBeInTheDocument();
});

test('chama onLogin com dados do formulario', async () => {
  renderLogin();
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'minhasenha' } });
  fireEvent.click(screen.getByRole('button', { name: /Acessar/i }));
  await waitFor(() => {
    expect(mockOnLogin).toHaveBeenCalledWith('12345678901', 'minhasenha');
  });
});

test('renderiza link de cadastro', () => {
  renderLogin();
  expect(screen.getByText(/Ainda nao tem conta/i)).toBeInTheDocument();
});

test('renderiza link de esqueci senha', () => {
  renderLogin();
  expect(screen.getByText(/Esqueci minha senha/i)).toBeInTheDocument();
});
