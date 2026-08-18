const mockContas = [
  { id: '1', tipo: 'CORRENTE', saldo: 15750.5, numero: '12345-6', agencia: '0001', status: 'ATIVA', dataAbertura: '2024-01-15', limite: 5000, rendimento: 0.5 },
  { id: '2', tipo: 'POUPANCA', saldo: 25000, numero: '12345-7', agencia: '0001', status: 'ATIVA', dataAbertura: '2024-03-10', rendimento: 0.5 },
];
const mockTransacoes = [
  { id: '1', codigo: 'TXN-001', tipo: 'PIX', descricao: 'Transferencia', valor: 1500, data: '2024-12-01T10:30:00', status: 'PROCESSADA', contaId: '1' },
];
const mockInvestimentos = [
  { id: '1', tipo: 'CDB', valorInvestido: 10000, taxa: 13.5, rendimento: 850, valorTotal: 10850, dataAplicacao: '2024-01-10', dataVencimento: '2025-01-10', status: 'ATIVO' },
];
const mockCartoes = [
  { id: '1', bandeira: 'Visa', tipo: 'CREDITO', status: 'ATIVO', numero: '**** **** **** 1234', nomePortador: 'Maria Silva', validade: '12/26', limite: 5000, disponivel: 3750 },
];
const mockFaturas = [
  { id: '1', cartaoId: '1', mesAno: '12/2024', valorTotal: 1250, valorPago: 1250, valorPendente: 0, vencimento: '10/12/2024', status: 'PAGA' },
];

const apiService = {
  getContas: jest.fn().mockResolvedValue({ data: mockContas }),
  getConta: jest.fn().mockResolvedValue({ data: mockContas[0] }),
  getExtratoConta: jest.fn().mockResolvedValue({ data: [] }),
  criarConta: jest.fn().mockResolvedValue({ data: { id: '3', tipo: 'CORRENTE' } }),
  atualizarConta: jest.fn().mockResolvedValue({ data: mockContas[0] }),
  getTransacoes: jest.fn().mockResolvedValue({ data: mockTransacoes }),
  criarTransacao: jest.fn().mockResolvedValue({ data: { id: '4', status: 'CONCLUIDA' } }),
  getTransacao: jest.fn().mockResolvedValue({ data: mockTransacoes[0] }),
  getTransacoesPeriodo: jest.fn().mockResolvedValue({ data: mockTransacoes }),
  enviarPix: jest.fn().mockResolvedValue({ data: { id: '1', status: 'CONCLUIDA' } }),
  receberPix: jest.fn().mockResolvedValue({ data: { id: '2', qrCode: 'base64...' } }),
  getChavesPix: jest.fn().mockResolvedValue({ data: [] }),
  criarChavePix: jest.fn().mockResolvedValue({ data: { id: '1' } }),
  deletarChavePix: jest.fn().mockResolvedValue({ data: {} }),
  getQrCodePix: jest.fn().mockResolvedValue({ data: { qrCodeUrl: 'data:image/png;base64,...', payload: '000201...' } }),
  lerQrCodePix: jest.fn().mockResolvedValue({ data: { valor: 100, destinatario: 'João' } }),
  getHistoricoPix: jest.fn().mockResolvedValue({ data: [] }),
  cancelarPix: jest.fn().mockResolvedValue({ data: { status: 'CANCELADO' } }),
  enviarTed: jest.fn().mockResolvedValue({ data: { id: '1', status: 'PENDENTE' } }),
  getHistoricoTed: jest.fn().mockResolvedValue({ data: [] }),
  getTed: jest.fn().mockResolvedValue({ data: {} }),
  cancelarTed: jest.fn().mockResolvedValue({ data: { status: 'CANCELADO' } }),
  getBoletos: jest.fn().mockResolvedValue({ data: [] }),
  getBoleto: jest.fn().mockResolvedValue({ data: {} }),
  emitirBoleto: jest.fn().mockResolvedValue({ data: { id: '1' } }),
  cancelarBoleto: jest.fn().mockResolvedValue({ data: { status: 'CANCELADO' } }),
  getBoletoPorCodigoBarras: jest.fn().mockResolvedValue({ data: {} }),
  pagarBoleto: jest.fn().mockResolvedValue({ data: { id: '1', status: 'PAGO' } }),
  getSimulacoesCredito: jest.fn().mockResolvedValue({ data: [] }),
  simularCredito: jest.fn().mockResolvedValue({ data: { parcelas: 12, valorParcela: 90 } }),
  getSolicitacoesCredito: jest.fn().mockResolvedValue({ data: [] }),
  solicitarCredito: jest.fn().mockResolvedValue({ data: { id: '1', status: 'PENDENTE' } }),
  getSolicitacaoCredito: jest.fn().mockResolvedValue({ data: {} }),
  getParcelasCredito: jest.fn().mockResolvedValue({ data: [] }),
  getInvestimentos: jest.fn().mockResolvedValue({ data: mockInvestimentos }),
  criarInvestimento: jest.fn().mockResolvedValue({ data: { id: '3' } }),
  simularInvestimento: jest.fn().mockResolvedValue({ data: { valorInvestido: 10000, valorLiquido: 11500 } }),
  getCartoes: jest.fn().mockResolvedValue({ data: mockCartoes }),
  emitirCartao: jest.fn().mockResolvedValue({ data: { id: '3', status: 'ATIVO' } }),
  getFaturas: jest.fn().mockResolvedValue({ data: mockFaturas }),
  pagarFatura: jest.fn().mockResolvedValue({ data: { id: '1', status: 'PAGA' } }),
  getClienteAtual: jest.fn().mockResolvedValue({ data: { id: '1', nome: 'Maria Silva' } }),
  getCliente: jest.fn().mockResolvedValue({ data: { id: '1', nome: 'Maria Silva' } }),
  atualizarCliente: jest.fn().mockResolvedValue({ data: { id: '1' } }),
  criarSolicitacaoPF: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  getSolicitacaoPF: jest.fn().mockResolvedValue({ data: { id: 1, cpf: '12345678900' } }),
  criarSolicitacaoPJ: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  getSolicitacaoPJ: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  adicionarSocioPJ: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  removerSocioPJ: jest.fn().mockResolvedValue({}),
  adicionarDocumentoPJ: jest.fn().mockResolvedValue({}),
  atualizarUsuario: jest.fn().mockResolvedValue({ data: {} }),
  atualizarConfiguracoes: jest.fn().mockResolvedValue({ data: {} }),
};

export { apiService };
export default apiService;
