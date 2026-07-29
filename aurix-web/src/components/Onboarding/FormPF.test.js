import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPF from './FormPF';
import { apiService } from '../../services/apiService';

jest.mock('../../services/apiService');

test('renders PF form fields', () => {
  render(<FormPF onComplete={jest.fn()} />);
  expect(screen.getByRole('textbox', { name: /CPF/ })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /Nome completo/ })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /E-mail/ })).toBeInTheDocument();
});

test('submits form successfully', async () => {
  apiService.criarSolicitacaoPF.mockResolvedValue({ data: { id: 42 } });
  const onComplete = jest.fn();
  render(<FormPF onComplete={onComplete} />);
  fireEvent.change(screen.getByRole('textbox', { name: /CPF/ }), { target: { value: '123.456.789-00' } });
  fireEvent.change(screen.getByRole('textbox', { name: /Nome completo/ }), { target: { value: 'João' } });
  fireEvent.change(screen.getByRole('textbox', { name: /E-mail/ }), { target: { value: 'joao@test.com' } });
  fireEvent.submit(screen.getByTestId('pf-form'));
  await waitFor(() => {
    expect(apiService.criarSolicitacaoPF).toHaveBeenCalledWith({
      cpf: '12345678900',
      nome: 'João',
      email: 'joao@test.com',
      telefone: '',
      dataNascimento: null,
      ocupacao: null,
      rendaDeclarada: null,
      endereco: null,
    });
  });
  await waitFor(() => {
    expect(onComplete).toHaveBeenCalledWith(42);
  });
});

test('shows error on missing required fields', () => {
  render(<FormPF onComplete={jest.fn()} />);
  fireEvent.submit(screen.getByTestId('pf-form'));
  expect(screen.getByText(/obrigatórios/i)).toBeInTheDocument();
});
