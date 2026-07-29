import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WizardPJ from './WizardPJ';
import { apiService } from '../../../services/apiService';

jest.mock('../../../services/apiService');
jest.mock('@mui/icons-material', () => ({
  Delete: 'Delete',
  Add: 'Add',
  CloudUpload: 'CloudUpload',
}));

test('renders step 1: empresa form', () => {
  render(<WizardPJ onComplete={jest.fn()} />);
  expect(screen.getByText('Dados da Empresa')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /cnpj/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /razão social/i })).toBeInTheDocument();
});

test('submits empresa and advances to socios step', async () => {
  apiService.criarSolicitacaoPJ.mockResolvedValue({ data: { id: 99 } });
  render(<WizardPJ onComplete={jest.fn()} />);
  fireEvent.change(screen.getByRole('textbox', { name: /cnpj/i }), { target: { value: '12.345.678/0001-90' } });
  fireEvent.change(screen.getByRole('textbox', { name: /razão social/i }), { target: { value: 'Empresa Ltda' } });
  fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'contato@empresa.com' } });
  fireEvent.click(screen.getByRole('button', { name: /criar solicitação/i }));
  await waitFor(() => expect(screen.getByText('Sócios')).toBeInTheDocument());
  expect(apiService.criarSolicitacaoPJ).toHaveBeenCalled();
});

test('shows error when empresa required fields missing', () => {
  render(<WizardPJ onComplete={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /criar solicitação/i }));
  expect(screen.getByText(/obrigatórios/i)).toBeInTheDocument();
});

test('full wizard flow to completion', async () => {
  apiService.criarSolicitacaoPJ.mockResolvedValue({ data: { id: 50 } });
  const onComplete = jest.fn();
  render(<WizardPJ onComplete={onComplete} />);

  // Step 0: empresa → criar solicitação
  fireEvent.change(screen.getByRole('textbox', { name: /cnpj/i }), { target: { value: '12.345.678/0001-90' } });
  fireEvent.change(screen.getByRole('textbox', { name: /razão social/i }), { target: { value: 'Empresa Ltda' } });
  fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'c@e.com' } });
  fireEvent.click(screen.getByRole('button', { name: /criar solicitação/i }));
  await waitFor(() => expect(screen.getByText(/nenhum sócio/i)).toBeInTheDocument());

  // Step 1: socios (skip) → click last button (Próximo)
  const nextBtn1 = screen.getAllByRole('button');
  fireEvent.click(nextBtn1[nextBtn1.length - 1]);
  await waitFor(() => expect(screen.getByText(/nenhum documento/i)).toBeInTheDocument());

  // Step 2: documentos (skip) → click last button (Próximo)
  const nextBtn2 = screen.getAllByRole('button');
  fireEvent.click(nextBtn2[nextBtn2.length - 1]);
  await waitFor(() => expect(screen.getByText(/Solicitação #50/i)).toBeInTheDocument());

  // Step 3: revisao → finish
  await waitFor(() => {
    const finishBtns = screen.getAllByRole('button');
    const finishBtn = finishBtns.find(b => /acompanhamento/i.test(b.textContent));
    if (finishBtn) fireEvent.click(finishBtn);
    expect(onComplete).toHaveBeenCalledWith(50);
  });
});
