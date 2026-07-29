import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagamento from './Pagamento';

describe('Pagamento', () => {
  test('renders page title', () => {
    render(<Pagamento user={{ nome: 'João' }} />);
    expect(screen.getByText(/Pagamento/i)).toBeInTheDocument();
  });

  test('renders barcode input', () => {
    render(<Pagamento user={{ nome: 'João' }} />);
    expect(screen.getByLabelText(/Código de Barras/i)).toBeInTheDocument();
  });

  test('renders payment info after barcode entry', () => {
    render(<Pagamento user={{ nome: 'João' }} />);
    const input = screen.getByLabelText(/Código de Barras/i);
    fireEvent.change(input, { target: { value: '12345678901234567890123456789012345678901234' } });
    expect(screen.getByText(/Vencimento/i)).toBeInTheDocument();
  });

  test('renders confirmation dialog on pay', () => {
    render(<Pagamento user={{ nome: 'João' }} />);
    const input = screen.getByLabelText(/Código de Barras/i);
    fireEvent.change(input, { target: { value: '123' } });
    const consultBtn = screen.getByText('Consultar');
    fireEvent.click(consultBtn);
    const payBtn = screen.getByText('Pagar');
    fireEvent.click(payBtn);
    expect(screen.getByText(/Confirmar Pagamento/i)).toBeInTheDocument();
  });
});
