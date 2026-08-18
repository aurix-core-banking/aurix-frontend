import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import NovoPix from './NovoPix';

jest.mock('../../services/apiService');

beforeEach(() => {
  jest.clearAllMocks();
});

test('renderiza titulo Novo PIX', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByText(/Novo PIX/i)).toBeInTheDocument();
});

test('renderiza selecao de tipo de chave', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByLabelText(/Tipo de Chave/i)).toBeInTheDocument();
});

test('renderiza campo de chave pix', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByLabelText(/Chave Pix/i)).toBeInTheDocument();
});

test('renderiza campo de valor', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByLabelText(/Valor/i)).toBeInTheDocument();
});

test('renderiza campo de descricao', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByLabelText(/Descrição/i)).toBeInTheDocument();
});

test('renderiza botao Continuar', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByRole('button', { name: /Continuar/i })).toBeInTheDocument();
});

test('renderiza secao QR Code', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByText(/QR Code PIX/i)).toBeInTheDocument();
});

test('renderiza botao Gerar QR Code', async () => {
  renderWithProviders(<NovoPix />);
  expect(await screen.findByRole('button', { name: /Gerar QR Code/i })).toBeInTheDocument();
});

test('botao Continuar desabilitado quando campos obrigatorios vazios', async () => {
  renderWithProviders(<NovoPix />);
  const continuarBtn = await screen.findByRole('button', { name: /Continuar/i });
  expect(continuarBtn).toBeDisabled();
});

test('permite selecionar tipo de chave', async () => {
  renderWithProviders(<NovoPix />);
  const tipoChave = await screen.findByLabelText(/Tipo de Chave/i);
  fireEvent.mouseDown(tipoChave);
  expect(await screen.findByText(/E-mail/i)).toBeInTheDocument();
  expect(await screen.findByText(/Telefone/i)).toBeInTheDocument();
  expect(await screen.findByText(/Chave Aleatória/i)).toBeInTheDocument();
});
