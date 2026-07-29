jest.mock('../../services/apiService', () => ({
  getInvestimentos: jest.fn().mockResolvedValue({
    data: [
      { id: '1', tipo: 'CDB', valorInvestido: 10000, taxa: 13.5, rendimento: 850, valorTotal: 10850, status: 'ATIVO' },
    ],
  }),
  simularInvestimento: jest.fn().mockResolvedValue({ data: { valorInvestido: 10000, valorLiquido: 11500 } }),
  criarInvestimento: jest.fn().mockResolvedValue({ data: { id: '2' } }),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Investimentos from './Investimentos';

test('renderiza resumo', () => {
  renderWithProviders(<Investimentos />);
  expect(screen.getByText(/Total Investido/i)).toBeInTheDocument();
});

test('renderiza investimentos carregados', async () => {
  renderWithProviders(<Investimentos />);
  expect(await screen.findByText(/CDB/i)).toBeInTheDocument();
});

test('abre dialog de simulacao', async () => {
  renderWithProviders(<Investimentos />);
  const simBtn = await screen.findByText(/Simular/i);
  fireEvent.click(simBtn);
  expect(screen.getByText(/Tipo de Investimento/i)).toBeInTheDocument();
});
