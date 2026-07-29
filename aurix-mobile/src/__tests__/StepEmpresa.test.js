import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StepEmpresa from '../pages/onboarding/StepEmpresa';

const mockNavigate = jest.fn();
const props = { navigation: { navigate: mockNavigate } };

describe('StepEmpresa', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders CNPJ field and Próximo button', () => {
    const { getByText, getByPlaceholderText } = render(<StepEmpresa {...props} />);
    expect(getByPlaceholderText('00.000.000/0000-00')).toBeTruthy();
    expect(getByText('Próximo')).toBeTruthy();
  });

  it('shows CNPJ validation error for invalid CNPJ', () => {
    const { getByText, getByPlaceholderText } = render(<StepEmpresa {...props} />);
    const cnpjInput = getByPlaceholderText('00.000.000/0000-00');
    fireEvent.changeText(cnpjInput, '11.111.111/1111-11');
    fireEvent.press(getByText('Próximo'));
    expect(getByText('CNPJ inválido')).toBeTruthy();
  });

  it('formats CNPJ as user types', () => {
    const { getByPlaceholderText } = render(<StepEmpresa {...props} />);
    const cnpjInput = getByPlaceholderText('00.000.000/0000-00');
    fireEvent.changeText(cnpjInput, '11222333000181');
    expect(cnpjInput.props.value).toBe('11.222.333/0001-81');
  });
});
