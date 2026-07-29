jest.mock('../../services/apiService', () => ({
  enviarPix: jest.fn().mockResolvedValue({ data: { id: '1', status: 'CONCLUIDA' } }),
  receberPix: jest.fn().mockResolvedValue({ data: { qrCode: 'base64...' } }),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import PIX from './PIX';

test('renderiza tres abas', () => {
  renderWithProviders(<PIX />);
  expect(screen.getByText(/Enviar PIX/i)).toBeInTheDocument();
  expect(screen.getByText(/Receber PIX/i)).toBeInTheDocument();
  expect(screen.getByText(/Chaves PIX/i)).toBeInTheDocument();
});

test('aba enviar PIX tem campos do formulario', () => {
  renderWithProviders(<PIX />);
  expect(screen.getByText(/Tipo de Chave/i)).toBeInTheDocument();
  expect(screen.getByText(/Chave/i)).toBeInTheDocument();
});

test('aba receber PIX tem campo de valor', () => {
  renderWithProviders(<PIX />);
  fireEvent.click(screen.getByText(/Receber PIX/i));
  expect(screen.getByText(/Valor/i)).toBeInTheDocument();
});

test('aba chaves PIX mostra placeholder', () => {
  renderWithProviders(<PIX />);
  fireEvent.click(screen.getByText(/Chaves PIX/i));
  expect(screen.getByText(/em desenvolvimento/i)).toBeInTheDocument();
});
