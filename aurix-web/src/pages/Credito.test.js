import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Credito from './Credito';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ valorParcela: 500, total: 12000 }),
  });
});

afterEach(() => {
  delete global.fetch;
});

test('renderiza formulario de simulacao', () => {
  renderWithProviders(<Credito />);
  expect(screen.getByText(/Simular Credito/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/valor desejado/i)).toBeInTheDocument();
});

test('chama fetch ao simular', async () => {
  renderWithProviders(<Credito />);
  fireEvent.change(screen.getByLabelText(/valor desejado/i), { target: { value: '10000' } });
  fireEvent.click(screen.getByText(/Simular/i));
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
