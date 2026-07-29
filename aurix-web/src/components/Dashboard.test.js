import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './Dashboard';

const theme = createTheme();

function renderDashboard() {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    </BrowserRouter>
  );
}

test('renderiza saldo apos carregar', async () => {
  renderDashboard();
  expect(await screen.findByText(/15\.750,50/)).toBeInTheDocument();
});

test('renderiza titulo Resumo Financeiro', async () => {
  renderDashboard();
  expect(await screen.findByText(/Resumo Financeiro/i)).toBeInTheDocument();
});

test('renderiza transacoes recentes', async () => {
  renderDashboard();
  expect(await screen.findByText(/Transferencia para Joao/i)).toBeInTheDocument();
});

test('renderiza investimentos', async () => {
  renderDashboard();
  expect(await screen.findByText(/CDB/i)).toBeInTheDocument();
});

test('renderiza cartoes', async () => {
  renderDashboard();
  expect(await screen.findByText(/Credito/i)).toBeInTheDocument();
});

test('abre dialog do PIX', async () => {
  renderDashboard();
  const pixBtn = await screen.findByText(/Novo PIX/i);
  fireEvent.click(pixBtn);
  expect(screen.getByText(/Enviar PIX/i)).toBeInTheDocument();
});
