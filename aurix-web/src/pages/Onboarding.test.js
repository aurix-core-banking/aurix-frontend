import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Onboarding from './Onboarding';
import { apiService } from '../services/apiService';

jest.mock('../services/apiService');

test('renders tipo selector initially', () => {
  render(<Onboarding user={{ nome: 'Test' }} />);
  expect(screen.getByText('Pessoa Física')).toBeInTheDocument();
  expect(screen.getByText('Pessoa Jurídica')).toBeInTheDocument();
});

test('shows PF form when PF card clicked', () => {
  render(<Onboarding user={{ nome: 'Test' }} />);
  fireEvent.click(screen.getByText('Pessoa Física'));
  expect(screen.getByRole('textbox', { name: /cpf/i })).toBeInTheDocument();
});

test('shows PJ wizard when PJ card clicked', () => {
  render(<Onboarding user={{ nome: 'Test' }} />);
  fireEvent.click(screen.getByText('Pessoa Jurídica'));
  expect(screen.getByText('Dados da Empresa')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /cnpj/i })).toBeInTheDocument();
});

test('PF flow: from form to success after submit', async () => {
  apiService.criarSolicitacaoPF.mockResolvedValue({ data: { id: 42 } });
  render(<Onboarding user={{ nome: 'Test' }} />);
  fireEvent.click(screen.getByText('Pessoa Física'));
  fireEvent.change(screen.getByRole('textbox', { name: /cpf/i }), { target: { value: '123.456.789-00' } });
  fireEvent.change(screen.getByRole('textbox', { name: /nome completo/i }), { target: { value: 'João' } });
  fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'joao@test.com' } });
  fireEvent.submit(screen.getByTestId('pf-form'));
  await waitFor(() => expect(screen.getByText(/protocolo/i)).toBeInTheDocument());
  expect(screen.getByText(/#42/i)).toBeInTheDocument();
});

test('PJ flow: from wizard to tracking after create', async () => {
  apiService.criarSolicitacaoPJ.mockResolvedValue({ data: { id: 99 } });
  apiService.getSolicitacaoPJ.mockResolvedValue({
    data: { id: 99, cnpj: '12345678000190', razaoSocial: 'Empresa', email: 'c@e.com', status: 'EM_PREENCHIMENTO', historico: [], documentos: [] },
  });
  render(<Onboarding user={{ nome: 'Test' }} />);
  fireEvent.click(screen.getByText('Pessoa Jurídica'));
  fireEvent.change(screen.getByRole('textbox', { name: /cnpj/i }), { target: { value: '12.345.678/0001-90' } });
  fireEvent.change(screen.getByRole('textbox', { name: /razão social/i }), { target: { value: 'Empresa Ltda' } });
  fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'c@e.com' } });
  fireEvent.click(screen.getByRole('button', { name: /criar solicitação/i }));
  await waitFor(() => expect(apiService.criarSolicitacaoPJ).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByText(/nenhum sócio/i)).toBeInTheDocument());
  const btns1 = screen.getAllByRole('button');
  fireEvent.click(btns1[btns1.length - 1]);
  await waitFor(() => expect(screen.getByText(/nenhum documento/i)).toBeInTheDocument());
  const btns2 = screen.getAllByRole('button');
  fireEvent.click(btns2[btns2.length - 1]);
  await waitFor(() => expect(screen.getByText(/acompanhamento/i)).toBeInTheDocument());
  const finishBtn = screen.getAllByRole('button').find(b => /acompanhamento/i.test(b.textContent));
  fireEvent.click(finishBtn);
  await waitFor(() => expect(screen.getByText(/solicitação #99/i)).toBeInTheDocument());
});

test('back button returns to selector from form', () => {
  render(<Onboarding user={{ nome: 'Test' }} />);
  fireEvent.click(screen.getByText('Pessoa Jurídica'));
  fireEvent.click(screen.getByText('Voltar'));
  expect(screen.getByText('Pessoa Física')).toBeInTheDocument();
});
