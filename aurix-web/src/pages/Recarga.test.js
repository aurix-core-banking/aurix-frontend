import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Recarga from './Recarga';

describe('Recarga', () => {
  test('renders page title', () => {
    render(<Recarga user={{ nome: 'João' }} />);
    expect(screen.getByText(/Recarga/i)).toBeInTheDocument();
  });

  test('renders operator selector', () => {
    render(<Recarga user={{ nome: 'João' }} />);
    expect(screen.getByText('Vivo')).toBeInTheDocument();
    expect(screen.getByText('Claro')).toBeInTheDocument();
  });

  test('renders phone input', () => {
    render(<Recarga user={{ nome: 'João' }} />);
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
  });

  test('renders confirmation dialog on confirm', () => {
    render(<Recarga user={{ nome: 'João' }} />);
    const operadoraSelect = screen.getByLabelText(/Operadora/i);
    fireEvent.mouseDown(operadoraSelect);
    const opcaoVivo = screen.getByText('Vivo');
    fireEvent.click(opcaoVivo);

    const telefoneInput = screen.getByLabelText(/Telefone/i);
    fireEvent.change(telefoneInput, { target: { value: '11999999999' } });

    const valorSelect = screen.getByLabelText(/Valor/i);
    fireEvent.mouseDown(valorSelect);
    const opcao10 = screen.getByText('R$ 10,00');
    fireEvent.click(opcao10);

    const confirmBtn = screen.getByText('Confirmar');
    fireEvent.click(confirmBtn);
    expect(screen.getByText(/Confirmar Recarga/i)).toBeInTheDocument();
  });
});
