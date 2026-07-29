import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Extrato from './Extrato';

jest.mock('../services/apiService');

test('renderiza titulo Extrato Bancario', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Extrato Bancário/i)).toBeInTheDocument();
});

test('renderiza seletor de conta', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Selecione uma conta/i)).toBeInTheDocument();
});

test('renderiza filtros de data', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByLabelText(/Data Inicial/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/Data Final/i)).toBeInTheDocument();
});

test('renderiza transacoes apos consulta', async () => {
  renderWithProviders(<Extrato />);
  const consultarBtn = await screen.findByRole('button', { name: /Consultar/i });
  fireEvent.click(consultarBtn);
  expect(await screen.findByText(/PIX recebido - João Silva/i)).toBeInTheDocument();
});

test('renderiza botao Download PDF', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Download PDF/i)).toBeInTheDocument();
});
