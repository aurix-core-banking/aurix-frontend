import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../test-utils';
import Dashboard from './Dashboard';

test('renderiza saudacao com nome do usuario', () => {
  renderWithProviders(<Dashboard />);
  expect(screen.getByText(/Maria Silva/i)).toBeInTheDocument();
});

test('renderiza saldo da conta', async () => {
  renderWithProviders(<Dashboard />);
  expect(await screen.findByText(/15\.750,50/)).toBeInTheDocument();
});

test('renderiza resumo financeiro', async () => {
  renderWithProviders(<Dashboard />);
  expect(await screen.findByText(/Resumo Financeiro/i)).toBeInTheDocument();
});

test('renderiza transacoes', async () => {
  renderWithProviders(<Dashboard />);
  expect(await screen.findByText(/Transferencia para Joao/i)).toBeInTheDocument();
});

test('renderiza investimentos', async () => {
  renderWithProviders(<Dashboard />);
  expect(await screen.findByText(/CDB/i)).toBeInTheDocument();
});
