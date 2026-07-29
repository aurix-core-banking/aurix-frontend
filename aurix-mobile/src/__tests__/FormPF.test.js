import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormPF from '../pages/onboarding/FormPF';

const mockNavigate = jest.fn();
const props = { navigation: { navigate: mockNavigate } };

describe('FormPF', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all section headers', () => {
    const { getByText } = render(<FormPF {...props} />);
    expect(getByText('Dados Pessoais')).toBeTruthy();
    expect(getByText('Contato')).toBeTruthy();
    expect(getByText('Financeiro')).toBeTruthy();
    expect(getByText('Endereço')).toBeTruthy();
  });

  it('shows validation errors for empty required fields on submit', () => {
    const { getByText } = render(<FormPF {...props} />);
    fireEvent.press(getByText('Enviar Solicitação'));
    expect(getByText('CPF é obrigatório')).toBeTruthy();
    expect(getByText('Nome é obrigatório')).toBeTruthy();
  });

  it('shows CPF validation error for invalid CPF', () => {
    const { getByText, getByPlaceholderText } = render(<FormPF {...props} />);
    const cpfInput = getByPlaceholderText('000.000.000-00');
    fireEvent.changeText(cpfInput, '123.456.789-00');
    fireEvent.press(getByText('Enviar Solicitação'));
    expect(getByText('CPF inválido')).toBeTruthy();
  });

  it('formats CPF as user types', () => {
    const { getByPlaceholderText } = render(<FormPF {...props} />);
    const cpfInput = getByPlaceholderText('000.000.000-00');
    fireEvent.changeText(cpfInput, '12345678901');
    expect(cpfInput.props.value).toBe('123.456.789-01');
  });

  it('formats phone as user types', () => {
    const { getByPlaceholderText } = render(<FormPF {...props} />);
    const phoneInput = getByPlaceholderText('(00) 00000-0000');
    fireEvent.changeText(phoneInput, '11999998888');
    expect(phoneInput.props.value).toBe('(11) 99999-8888');
  });
});
