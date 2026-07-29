import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, mockContas } from '../../test-utils';
import Contas from './Contas';

test('renderiza titulo Minhas Contas', () => {
  renderWithProviders(<Contas />);
  expect(screen.getByText(/Minhas Contas/i)).toBeInTheDocument();
});

test('renderiza contas mockadas', async () => {
  renderWithProviders(<Contas />);
  expect(await screen.findByText(/Corrente/i)).toBeInTheDocument();
  expect(screen.getByText(/Poupanca/i)).toBeInTheDocument();
});
