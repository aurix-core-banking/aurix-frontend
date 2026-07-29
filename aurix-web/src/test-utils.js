import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
});

export const mockUser = {
  nome: 'Maria Silva',
  email: 'maria@test.com',
  cpf: '12345678901',
  telefone: '(11) 99999-8888',
  conta: { id: '1', saldo: 15750.5, numero: '12345-6', agencia: '0001', tipo: 'CORRENTE' },
};

export const mockContas = [
  { id: '1', tipo: 'CORRENTE', saldo: 15750.5, numero: '12345-6', agencia: '0001', status: 'ATIVA', dataAbertura: '2024-01-15', limite: 5000, rendimento: 0.5 },
  { id: '2', tipo: 'POUPANCA', saldo: 25000, numero: '12345-7', agencia: '0001', status: 'ATIVA', dataAbertura: '2024-03-10', rendimento: 0.5 },
  { id: '3', tipo: 'INVESTIMENTO', saldo: 50000, numero: '12345-8', agencia: '0001', status: 'ATIVA', dataAbertura: '2024-06-20', rendimento: 1.2 },
];

export const mockTransacoes = [
  { id: '1', codigo: 'TXN-001', tipo: 'PIX', descricao: 'Transferencia para Joao', valor: 1500, data: '2024-12-01T10:30:00', status: 'CONCLUIDA', contaId: '1' },
  { id: '2', codigo: 'TXN-002', tipo: 'TED', descricao: 'Pagamento fornecedor', valor: 3500, data: '2024-12-02T14:00:00', status: 'CONCLUIDA', contaId: '1' },
  { id: '3', codigo: 'TXN-003', tipo: 'DOC', descricao: 'Aluguel', valor: 2500, data: '2024-12-03T09:00:00', status: 'PENDENTE', contaId: '1' },
];

export const mockInvestimentos = [
  { id: '1', tipo: 'CDB', valorInvestido: 10000, taxa: 13.5, rendimento: 850, valorTotal: 10850, dataAplicacao: '2024-01-10', dataVencimento: '2025-01-10', status: 'ATIVO' },
  { id: '2', tipo: 'LCI', valorInvestido: 5000, taxa: 12.0, rendimento: 300, valorTotal: 5300, dataAplicacao: '2024-03-15', dataVencimento: '2025-03-15', status: 'ATIVO' },
];

export const mockCartoes = [
  { id: '1', bandeira: 'Visa', tipo: 'CREDITO', status: 'ATIVO', numero: '**** **** **** 1234', nomePortador: 'Maria Silva', validade: '12/26', limite: 5000, disponivel: 3750 },
  { id: '2', bandeira: 'Mastercard', tipo: 'DEBITO', status: 'ATIVO', numero: '**** **** **** 5678', nomePortador: 'Maria Silva', validade: '12/26' },
];

export const mockFaturas = [
  { id: '1', cartaoId: '1', mesAno: '12/2024', valorTotal: 1250, valorPago: 1250, valorPendente: 0, vencimento: '10/12/2024', status: 'PAGA' },
  { id: '2', cartaoId: '1', mesAno: '01/2025', valorTotal: 1500, valorPago: 0, valorPendente: 1500, vencimento: '10/01/2025', status: 'PENDENTE' },
];

export function renderWithProviders(ui, { user = mockUser } = {}) {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {React.cloneElement(ui, { user })}
      </ThemeProvider>
    </BrowserRouter>
  );
}
