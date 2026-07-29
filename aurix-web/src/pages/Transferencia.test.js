import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Transferencia from './Transferencia';

test('renderiza titulo Transferencia', () => {
  renderWithProviders(<Transferencia />);
  expect(screen.getByRole('heading', { name: /Transferência/i })).toBeInTheDocument();
});

test('renderiza seletor de tipo de transferencia com TED DOC PIX', () => {
  renderWithProviders(<Transferencia />);
  const select = screen.getByRole('combobox', { name: /Tipo de Transferência/i });
  expect(select).toBeInTheDocument();
  fireEvent.mouseDown(select);
  expect(screen.getByRole('option', { name: /TED/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /DOC/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /PIX/i })).toBeInTheDocument();
});

test('renderiza campos de conta destino (Banco, Agencia)', () => {
  renderWithProviders(<Transferencia />);
  expect(screen.getByLabelText(/Banco/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Agência/i)).toBeInTheDocument();
});

test('renderiza dialogo de confirmacao ao clicar em Transferir', () => {
  renderWithProviders(<Transferencia />);
  const valorInput = screen.getByLabelText(/Valor/i);
  fireEvent.change(valorInput, { target: { value: '1500' } });
  const transferirBtn = screen.getByRole('button', { name: /Transferir/i });
  fireEvent.click(transferirBtn);
  expect(screen.getByText(/Confirmar Transferência/i)).toBeInTheDocument();
});
