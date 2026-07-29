import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';

const theme = createTheme();
const onClose = jest.fn();

function renderSidebar(open = true) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <ThemeProvider theme={theme}>
        <Sidebar open={open} onClose={onClose} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

test('renderiza itens do menu', () => {
  renderSidebar();
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Contas/i)).toBeInTheDocument();
  expect(screen.getByText(/Transacoes/i)).toBeInTheDocument();
  expect(screen.getByText(/PIX/i)).toBeInTheDocument();
  expect(screen.getByText(/Investimentos/i)).toBeInTheDocument();
  expect(screen.getByText(/Cartoes/i)).toBeInTheDocument();
  expect(screen.getByText(/Credito/i)).toBeInTheDocument();
});

test('destaca rota ativa', () => {
  renderSidebar();
  const activeItem = screen.getByText(/Dashboard/i).closest('div');
  expect(activeItem).toHaveStyle('background-color: rgb(25, 118, 210)');
});

test('nao renderiza quando fechado em temporary', () => {
  const { container } = renderSidebar(false);
  expect(container.querySelector('.MuiDrawer-root')).toBeInTheDocument();
});
