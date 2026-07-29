import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './Navbar';

const theme = createTheme();
const mockUser = { nome: 'Maria Silva', email: 'maria@test.com' };
const onLogout = jest.fn();
const onToggleSidebar = jest.fn();

function renderNavbar(props = {}) {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navbar user={mockUser} onLogout={onLogout} onToggleSidebar={onToggleSidebar} {...props} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

test('renderiza nome do banco', () => {
  renderNavbar();
  expect(screen.getByText(/AUREUS Internet Banking/i)).toBeInTheDocument();
});

test('renderiza nome do usuario', () => {
  renderNavbar();
  expect(screen.getByText(/Maria Silva/i)).toBeInTheDocument();
});

test('abre menu do profile ao clicar no avatar', () => {
  renderNavbar();
  fireEvent.click(screen.getByText(/MS/i));
  expect(screen.getByText(/Meu Perfil/i)).toBeInTheDocument();
  expect(screen.getByText(/Sair/i)).toBeInTheDocument();
});

test('chama onLogout ao clicar em Sair', () => {
  renderNavbar();
  fireEvent.click(screen.getByText(/MS/i));
  fireEvent.click(screen.getByText(/Sair/i));
  expect(onLogout).toHaveBeenCalled();
});

test('chama onToggleSidebar ao clicar no menu hamburguer', () => {
  renderNavbar();
  const menuBtn = document.querySelector('[data-testid="MenuIcon"]')?.closest('button')
    || document.querySelector('button');
  if (menuBtn) fireEvent.click(menuBtn);
  expect(onToggleSidebar).toHaveBeenCalled();
});

test('mostra badge de notificacoes', () => {
  renderNavbar();
  const badge = screen.getByText('3');
  expect(badge).toBeInTheDocument();
});
