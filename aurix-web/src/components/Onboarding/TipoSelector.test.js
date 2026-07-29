import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TipoSelector from './TipoSelector';

jest.mock('@mui/icons-material', () => ({
  Person: () => <span data-testid="PersonIcon" />,
  Business: () => <span data-testid="BusinessIcon" />,
}));

test('renders PF and PJ cards', () => {
  const onSelect = jest.fn();
  render(<TipoSelector onSelect={onSelect} />);
  expect(screen.getByText('Pessoa Física')).toBeInTheDocument();
  expect(screen.getByText('Pessoa Jurídica')).toBeInTheDocument();
});

test('calls onSelect with PF when PF card clicked', () => {
  const onSelect = jest.fn();
  render(<TipoSelector onSelect={onSelect} />);
  fireEvent.click(screen.getByText('Pessoa Física'));
  expect(onSelect).toHaveBeenCalledWith('PF');
});

test('calls onSelect with PJ when PJ card clicked', () => {
  const onSelect = jest.fn();
  render(<TipoSelector onSelect={onSelect} />);
  fireEvent.click(screen.getByText('Pessoa Jurídica'));
  expect(onSelect).toHaveBeenCalledWith('PJ');
});
