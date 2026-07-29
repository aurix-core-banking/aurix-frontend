import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShellProvider } from '../../../context/ShellContext';
import AppLauncher from './AppLauncher';
import CommandPalette from './CommandPalette';
import NotificationDrawer from './NotificationDrawer';
import UserProfileMenu from './UserProfileMenu';

const renderWithProviders = (ui) => render(
  <BrowserRouter>
    <ShellProvider>
      {ui}
    </ShellProvider>
  </BrowserRouter>
);

describe('Header Components', () => {
  describe('AppLauncher', () => {
    it('renders drawer with apps when open', () => {
      renderWithProviders(<AppLauncher open={true} onClose={jest.fn()} />);
      
      expect(screen.getByText('AUREUS Banking')).toBeInTheDocument();
      expect(screen.getByText('AUREUS Admin')).toBeInTheDocument();
      expect(screen.getByText('Investimentos')).toBeInTheDocument();
      expect(screen.getByText('Crédito & Empréstimos')).toBeInTheDocument();
      expect(screen.getByText('Fraude & Compliance')).toBeInTheDocument();
      expect(screen.getByText('Configurações')).toBeInTheDocument();
    });
  });

  describe('CommandPalette', () => {
    it('opens dialog and allows typing', () => {
      renderWithProviders(<CommandPalette open={true} onClose={jest.fn()} />);
      const input = screen.getByPlaceholderText(/Digite um comando/i);
      fireEvent.change(input, { target: { value: 'transfer' } });
      expect(input.value).toBe('transfer');
    });
  });

  describe('NotificationDrawer', () => {
    it('renders notification items when open', () => {
      renderWithProviders(<NotificationDrawer open={true} onClose={jest.fn()} />);
      expect(screen.getByText(/Notificações/i)).toBeInTheDocument();
    });
  });

  describe('UserProfileMenu', () => {
    it('renders menu items when open', () => {
      renderWithProviders(<UserProfileMenu open={true} anchorEl={document.body} onClose={jest.fn()} onLogout={jest.fn()} />);
      
      expect(screen.getByText(/Sair da Conta/i)).toBeInTheDocument();
      expect(screen.getByText(/Modo Claro/i)).toBeInTheDocument();
    });
  });
});
