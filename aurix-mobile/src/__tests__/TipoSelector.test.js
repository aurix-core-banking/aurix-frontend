import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TipoSelector from '../pages/onboarding/TipoSelector';

const mockNavigate = jest.fn();
const props = { navigation: { navigate: mockNavigate } };

describe('TipoSelector', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders both PF and PJ cards', () => {
    const { getByText } = render(<TipoSelector {...props} />);
    expect(getByText('Pessoa Física')).toBeTruthy();
    expect(getByText('Pessoa Jurídica')).toBeTruthy();
  });

  it('renders app title and subtitle', () => {
    const { getByText } = render(<TipoSelector {...props} />);
    expect(getByText('AUREUS Banking')).toBeTruthy();
    expect(getByText('Abra sua conta')).toBeTruthy();
  });

  it('navigates to FormPF when PF card is pressed', () => {
    const { getByText } = render(<TipoSelector {...props} />);
    fireEvent.press(getByText('Pessoa Física'));
    expect(mockNavigate).toHaveBeenCalledWith('FormPF');
  });

  it('navigates to StepEmpresa when PJ card is pressed', () => {
    const { getByText } = render(<TipoSelector {...props} />);
    fireEvent.press(getByText('Pessoa Jurídica'));
    expect(mockNavigate).toHaveBeenCalledWith('StepEmpresa');
  });
});
