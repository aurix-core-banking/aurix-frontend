jest.mock('../../services/apiService', () => ({
  getTransacoes: jest.fn().mockResolvedValue({
    data: [
      { id: '1', codigo: 'TXN-001', tipo: 'PIX', descricao: 'Transferencia', valor: 1500, data: '2024-12-01T10:30:00', status: 'CONCLUIDA', contaId: '1' },
    ],
  }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Transacoes from './Transacoes';

test('renderiza titulo Transacoes', () => {
  renderWithProviders(<Transacoes />);
  expect(screen.getByText(/Transacoes/i)).toBeInTheDocument();
});

test('renderiza filtros', () => {
  renderWithProviders(<Transacoes />);
  expect(screen.getByText(/Conta/i)).toBeInTheDocument();
  expect(screen.getByText(/Tipo/i)).toBeInTheDocument();
  expect(screen.getByText(/Status/i)).toBeInTheDocument();
});

test('renderiza transacoes carregadas', async () => {
  renderWithProviders(<Transacoes />);
  expect(await screen.findByText(/TXN-001/i)).toBeInTheDocument();
});
