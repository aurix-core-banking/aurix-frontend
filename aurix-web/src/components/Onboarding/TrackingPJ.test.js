import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TrackingPJ from './TrackingPJ';
import { apiService } from '../../services/apiService';

jest.mock('../../services/apiService');
jest.mock('@mui/icons-material', () => ({
  CheckCircle: 'CheckCircle',
  HourglassEmpty: 'HourglassEmpty',
  Cancel: 'Cancel',
  ArrowBack: 'ArrowBack',
}));

const mockSolicitacao = {
  id: 99,
  cnpj: '12345678000190',
  razaoSocial: 'Empresa Ltda',
  email: 'contato@empresa.com',
  status: 'EM_PREENCHIMENTO',
  dataCriacao: '2026-07-06T10:00:00',
  dataAtualizacao: '2026-07-06T10:30:00',
  historico: [{ acao: 'Solicitação criada', dataAcao: '2026-07-06T10:00:00' }],
  documentos: [{ tipoDocumento: 'CONTRATO_SOCIAL', nomeArquivo: 'contrato.pdf', validado: false }],
};

test('renders solicitation details', async () => {
  apiService.getSolicitacaoPJ.mockResolvedValue({ data: mockSolicitacao });
  render(<TrackingPJ solicitacaoId={99} onNew={jest.fn()} />);
  await waitFor(() => expect(screen.getByText('Solicitação #99')).toBeInTheDocument());
  expect(screen.getByText('12345678000190')).toBeInTheDocument();
  expect(screen.getByText('Empresa Ltda')).toBeInTheDocument();
});

test('shows loading state', () => {
  apiService.getSolicitacaoPJ.mockReturnValue(new Promise(() => {}));
  render(<TrackingPJ solicitacaoId={99} onNew={jest.fn()} />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('shows error on API failure', async () => {
  apiService.getSolicitacaoPJ.mockRejectedValue(new Error('not found'));
  render(<TrackingPJ solicitacaoId={999} onNew={jest.fn()} />);
  await waitFor(() => expect(screen.getByText(/não foi possível/i)).toBeInTheDocument());
});
