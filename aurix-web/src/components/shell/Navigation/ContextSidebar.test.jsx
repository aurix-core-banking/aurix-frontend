import React from 'react';
import { render, screen } from '@testing-library/react';
import ContextSidebar from './ContextSidebar';
import { useShell } from '../../../context/ShellContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../context/ShellContext', () => ({
  useShell: jest.fn(),
}));

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ContextSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders banking navigation items when activeApp is banking', () => {
    useShell.mockReturnValue({
      activeApp: 'banking',
      sidebarCollapsed: false,
    });

    renderWithRouter(<ContextSidebar />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Contas & Saldos')).toBeInTheDocument();
    expect(screen.getByText('Extrato Bancário')).toBeInTheDocument();
    expect(screen.getByText('Área Pix')).toBeInTheDocument();
    expect(screen.getByText('Cartões')).toBeInTheDocument();
    expect(screen.getByText('Investimentos')).toBeInTheDocument();
  });

  it('renders admin navigation items when activeApp is admin', () => {
    useShell.mockReturnValue({
      activeApp: 'admin',
      sidebarCollapsed: false,
    });

    renderWithRouter(<ContextSidebar />);

    expect(screen.getByText('Visão Geral Admin')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Clientes')).toBeInTheDocument();
    expect(screen.getByText('Auditoria de Transações')).toBeInTheDocument();
  });

  it('renders settings navigation items when activeApp is settings', () => {
    useShell.mockReturnValue({
      activeApp: 'settings',
      sidebarCollapsed: false,
    });

    renderWithRouter(<ContextSidebar />);

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });
});
