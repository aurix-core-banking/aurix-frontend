import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Extrato from './Extrato';

jest.mock('../../services/apiService');

beforeEach(() => {
  jest.clearAllMocks();
});

test('renderiza titulo Extrato da Conta', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Extrato da Conta/i)).toBeInTheDocument();
});

test('renderiza seletor de conta', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Corrente/i)).toBeInTheDocument();
});

test('renderiza filtros de data', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByLabelText(/Data Inicial/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/Data Final/i)).toBeInTheDocument();
});

test('renderiza filtro de tipo', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByLabelText(/Tipo/i)).toBeInTheDocument();
});

test('renderiza filtros de valor', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByLabelText(/Valor Mín/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/Valor Máx/i)).toBeInTheDocument();
});

test('renderiza botao Exportar PDF', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Exportar PDF/i)).toBeInTheDocument();
});

test('renderiza botao Buscar', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByRole('button', { name: /Buscar/i })).toBeInTheDocument();
});

test('renderiza mensagem quando nao ha transacoes', async () => {
  renderWithProviders(<Extrato />);
  expect(await screen.findByText(/Nenhuma transação encontrada/i)).toBeInTheDocument();
});

test('permite selecionar tipo de transacao no filtro', async () => {
  renderWithProviders(<Extrato />);
  const tipoSelect = await screen.findByLabelText(/Tipo/i);
  fireEvent.mouseDown(tipoSelect);
  expect(await screen.findByText(/PIX/i)).toBeInTheDocument();
});
