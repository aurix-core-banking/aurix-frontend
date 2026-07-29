jest.mock('../../services/apiService', () => ({
  getCartoes: jest.fn().mockResolvedValue({
    data: [
      { id: '1', bandeira: 'Visa', tipo: 'CREDITO', status: 'ATIVO', numero: '**** **** **** 1234', nomePortador: 'Maria Silva', validade: '12/26', limite: 5000, disponivel: 3750 },
    ],
  }),
  getFaturas: jest.fn().mockResolvedValue({
    data: [
      { id: '1', cartaoId: '1', mesAno: '12/2024', valorTotal: 1250, valorPago: 1250, valorPendente: 0, vencimento: '10/12/2024', status: 'PAGA' },
    ],
  }),
  emitirCartao: jest.fn().mockResolvedValue({ data: { id: '2' } }),
  pagarFatura: jest.fn().mockResolvedValue({ data: { id: '1', status: 'PAGA' } }),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Cartoes from './Cartoes';

test('renderiza abas', () => {
  renderWithProviders(<Cartoes />);
  expect(screen.getByText(/Meus Cartoes/i)).toBeInTheDocument();
  expect(screen.getByText(/Faturas/i)).toBeInTheDocument();
});

test('renderiza cartoes carregados', async () => {
  renderWithProviders(<Cartoes />);
  expect(await screen.findByText(/Visa/i)).toBeInTheDocument();
});

test('renderiza faturas', async () => {
  renderWithProviders(<Cartoes />);
  fireEvent.click(screen.getByText(/Faturas/i));
  expect(await screen.findByText(/12\/2024/i)).toBeInTheDocument();
});
