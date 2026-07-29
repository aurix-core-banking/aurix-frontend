import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../test-utils';
import Perfil from './Perfil';

test('renderiza dados do usuario', () => {
  renderWithProviders(<Perfil />);
  expect(screen.getByDisplayValue(/Maria Silva/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue(/maria@test.com/i)).toBeInTheDocument();
});

test('habilita edicao ao clicar em Editar', () => {
  renderWithProviders(<Perfil />);
  const nomeInput = screen.getByDisplayValue(/Maria Silva/i);
  expect(nomeInput).toBeDisabled();
  fireEvent.click(screen.getByText(/Editar/i));
  expect(nomeInput).not.toBeDisabled();
});

test('cancela edicao e restaura valores', () => {
  renderWithProviders(<Perfil />);
  fireEvent.click(screen.getByText(/Editar/i));
  fireEvent.change(screen.getByDisplayValue(/Maria Silva/i), { target: { value: 'Outro Nome' } });
  fireEvent.click(screen.getByText(/Cancelar/i));
  expect(screen.getByDisplayValue(/Maria Silva/i)).toBeInTheDocument();
});
