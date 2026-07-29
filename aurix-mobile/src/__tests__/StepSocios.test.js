import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StepSocios from '../pages/onboarding/StepSocios';

const mockNavigate = jest.fn();
const mockRoute = { params: { empresaData: { cnpj: '11.222.333/0001-81', razaoSocial: 'Empresa X' } } };
const props = { navigation: { navigate: mockNavigate }, route: mockRoute };

describe('StepSocios', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders step indicator and add button', () => {
    const { getByText } = render(<StepSocios {...props} />);
    expect(getByText('Passo 2 de 2')).toBeTruthy();
    expect(getByText('Adicionar Sócio')).toBeTruthy();
  });

  it('opens modal when Adicionar Sócio is pressed', () => {
    const { getByText, getByPlaceholderText } = render(<StepSocios {...props} />);
    fireEvent.press(getByText('Adicionar Sócio'));
    expect(getByPlaceholderText('000.000.000-00')).toBeTruthy();
  });
});
