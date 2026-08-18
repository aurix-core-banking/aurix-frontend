import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Simulador from './Simulador';

jest.mock('../../services/apiService');

beforeEach(() => {
  jest.clearAllMocks();
});

test('renderiza titulo Simulador de Credito', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByText(/Simulador de Crédito/i)).toBeInTheDocument();
});

test('renderiza selecao de tipo de credito', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByLabelText(/Tipo de Crédito/i)).toBeInTheDocument();
});

test('renderiza campo de valor desejado', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByLabelText(/Valor Desejado/i)).toBeInTheDocument();
});

test('renderiza selecao de prazo', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByLabelText(/Prazo/i)).toBeInTheDocument();
});

test('renderiza campo de taxa de juros', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByLabelText(/Taxa de Juros/i)).toBeInTheDocument();
});

test('renderiza botao Simular', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByRole('button', { name: /Simular/i })).toBeInTheDocument();
});

test('renderiza mensagem placeholder quando nao ha simulacao', async () => {
  renderWithProviders(<Simulador />);
  expect(await screen.findByText(/Preencha o formulário e clique em "Simular"/i)).toBeInTheDocument();
});

test('permite selecionar tipo de credito', async () => {
  renderWithProviders(<Simulador />);
  const tipoSelect = await screen.findByLabelText(/Tipo de Crédito/i);
  fireEvent.mouseDown(tipoSelect);
  expect(await screen.findByText(/Crédito Consignado/i)).toBeInTheDocument();
  expect(await screen.findByText(/Crédito Pessoal/i)).toBeInTheDocument();
  expect(await screen.findByText(/Financiamento/i)).toBeInTheDocument();
});

test('permite alterar valor desejado', async () => {
  renderWithProviders(<Simulador />);
  const valorInput = await screen.findByLabelText(/Valor Desejado/i);
  fireEvent.change(valorInput, { target: { value: '50000' } });
  expect(valorInput.value).toBe('50000');
});

test('permite alterar prazo', async () => {
  renderWithProviders(<Simulador />);
  const prazoSelect = await screen.findByLabelText(/Prazo/i);
  fireEvent.mouseDown(prazoSelect);
  expect(await screen.findByText(/60 meses/i)).toBeInTheDocument();
});
