import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Configuracoes from './Configuracoes';

test('renderiza secoes de configuracao', () => {
  renderWithProviders(<Configuracoes />);
  expect(screen.getByText(/Seguranca/i)).toBeInTheDocument();
  expect(screen.getByText(/Notificacoes/i)).toBeInTheDocument();
  expect(screen.getByText(/Preferencias/i)).toBeInTheDocument();
});

test('alterna switch de 2FA', () => {
  renderWithProviders(<Configuracoes />);
  const switches = screen.getAllByRole('checkbox');
  fireEvent.click(switches[0]);
});

test('altera idioma', () => {
  renderWithProviders(<Configuracoes />);
  const select = screen.getByDisplayValue(/portugues/i);
  expect(select).toBeInTheDocument();
});
