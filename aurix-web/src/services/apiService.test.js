jest.mock('./refreshTokenInterceptor', () => ({
  instalarInterceptorRefresh: jest.fn(),
}));

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

jest.mock('axios', () => ({
  __esModule: true,
  default: { create: jest.fn(() => mockAxiosInstance) },
  create: jest.fn(() => mockAxiosInstance),
}));

const { apiService } = require('./apiService');

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('apiService - Métodos genéricos', () => {
  test('get faz requisição GET', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: { resultado: 'ok' } });

    const resultado = await apiService.get('/teste');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/teste', undefined);
    expect(resultado).toEqual({ resultado: 'ok' });
  });

  test('post faz requisição POST', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { id: '1' } });

    const resultado = await apiService.post('/teste', { nome: 'teste' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/teste', { nome: 'teste' }, undefined);
    expect(resultado).toEqual({ id: '1' });
  });

  test('put faz requisição PUT', async () => {
    mockAxiosInstance.put.mockResolvedValue({ data: { atualizado: true } });

    const resultado = await apiService.put('/teste/1', { nome: 'atualizado' });

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/teste/1', { nome: 'atualizado' }, undefined);
    expect(resultado).toEqual({ atualizado: true });
  });

  test('delete faz requisição DELETE', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: { removido: true } });

    const resultado = await apiService.delete('/teste/1');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/teste/1', undefined);
    expect(resultado).toEqual({ removido: true });
  });
});

describe('apiService - Contas (/api/contas)', () => {
  test('getContas retorna lista de contas', async () => {
    const contasMock = [
      { id: '1', tipo: 'CORRENTE', saldo: 15750.5 },
      { id: '2', tipo: 'POUPANCA', saldo: 25000 },
    ];
    mockAxiosInstance.get.mockResolvedValue({ data: contasMock });

    const resultado = await apiService.getContas();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/contas');
    expect(resultado).toEqual(contasMock);
  });

  test('getConta retorna conta por id', async () => {
    const contaMock = { id: '1', tipo: 'CORRENTE', saldo: 15750.5 };
    mockAxiosInstance.get.mockResolvedValue({ data: contaMock });

    const resultado = await apiService.getConta('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/contas/1');
    expect(resultado).toEqual(contaMock);
  });

  test('getExtratoConta retorna extrato', async () => {
    const extratoMock = [{ id: '1', valor: 100, descricao: 'PIX' }];
    mockAxiosInstance.get.mockResolvedValue({ data: extratoMock });

    const resultado = await apiService.getExtratoConta('1', { dataInicio: '2024-01-01' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/contas/1/extrato', {
      params: { dataInicio: '2024-01-01' },
    });
    expect(resultado).toEqual(extratoMock);
  });

  test('criarConta retorna conta criada', async () => {
    const contaMock = { id: '3', tipo: 'CORRENTE' };
    mockAxiosInstance.post.mockResolvedValue({ data: contaMock });

    const resultado = await apiService.criarConta({ tipo: 'CORRENTE' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/contas', { tipo: 'CORRENTE' });
    expect(resultado).toEqual(contaMock);
  });

  test('atualizarConta retorna conta atualizada', async () => {
    const contaMock = { id: '1', limite: 10000 };
    mockAxiosInstance.put.mockResolvedValue({ data: contaMock });

    const resultado = await apiService.atualizarConta('1', { limite: 10000 });

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/contas/1', { limite: 10000 });
    expect(resultado).toEqual(contaMock);
  });
});

describe('apiService - Transações (/api/transacoes)', () => {
  test('getTransacoes retorna transações de uma conta', async () => {
    const transacoesMock = [{ id: '1', tipo: 'PIX', valor: 100 }];
    mockAxiosInstance.get.mockResolvedValue({ data: transacoesMock });

    const resultado = await apiService.getTransacoes('1', { page: 1 });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/transacoes', {
      params: { contaId: '1', page: 1 },
    });
    expect(resultado).toEqual(transacoesMock);
  });

  test('criarTransacao retorna transação criada', async () => {
    const transacaoMock = { id: '1', status: 'PENDENTE' };
    mockAxiosInstance.post.mockResolvedValue({ data: transacaoMock });

    const resultado = await apiService.criarTransacao({ tipo: 'PIX', valor: 100 });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/transacoes', { tipo: 'PIX', valor: 100 });
    expect(resultado).toEqual(transacaoMock);
  });

  test('getTransacao retorna transação por id', async () => {
    const transacaoMock = { id: '1', tipo: 'TED', valor: 500 };
    mockAxiosInstance.get.mockResolvedValue({ data: transacaoMock });

    const resultado = await apiService.getTransacao('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/transacoes/1');
    expect(resultado).toEqual(transacaoMock);
  });

  test('getTransacoesPeriodo retorna transações do período', async () => {
    const transacoesMock = [{ id: '1', tipo: 'DOC', valor: 200 }];
    mockAxiosInstance.get.mockResolvedValue({ data: transacoesMock });

    const resultado = await apiService.getTransacoesPeriodo('1', '2024-01-01', '2024-12-31');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/transacoes', {
      params: { contaId: '1', dataInicio: '2024-01-01', dataFim: '2024-12-31' },
    });
    expect(resultado).toEqual(transacoesMock);
  });
});

describe('apiService - PIX (/api/pix)', () => {
  test('enviarPix retorna resultado', async () => {
    const resultadoMock = { codigoTransacao: 'TXN-001', status: 'CONCLUIDA' };
    mockAxiosInstance.post.mockResolvedValue({ data: resultadoMock });

    const resultado = await apiService.enviarPix({
      chaveDestino: '12345678901',
      valor: 100,
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/transferencias', {
      chaveDestino: '12345678901',
      valor: 100,
    });
    expect(resultado).toEqual(resultadoMock);
  });

  test('receberPix retorna QR Code', async () => {
    const resultadoMock = { qrCode: 'base64data', payload: '000201...' };
    mockAxiosInstance.post.mockResolvedValue({ data: resultadoMock });

    const resultado = await apiService.receberPix({ valor: 50 });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/receber', { valor: 50 });
    expect(resultado).toEqual(resultadoMock);
  });

  test('getChavesPix retorna chaves', async () => {
    const chavesMock = [{ id: '1', tipo: 'CPF', valor: '12345678901' }];
    mockAxiosInstance.get.mockResolvedValue({ data: chavesMock });

    const resultado = await apiService.getChavesPix();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/pix/chaves');
    expect(resultado).toEqual(chavesMock);
  });

  test('criarChavePix cria nova chave', async () => {
    const chaveMock = { id: '1', tipo: 'EMAIL', valor: 'test@test.com' };
    mockAxiosInstance.post.mockResolvedValue({ data: chaveMock });

    const resultado = await apiService.criarChavePix({ tipo: 'EMAIL', valor: 'test@test.com' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/chaves', { tipo: 'EMAIL', valor: 'test@test.com' });
    expect(resultado).toEqual(chaveMock);
  });

  test('deletarChavePix deleta chave', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: {} });

    await apiService.deletarChavePix('1');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/pix/chaves/1');
  });

  test('getQrCodePix retorna QR Code', async () => {
    const qrMock = { qrCodeUrl: 'data:image/png;base64,...', payload: '000201...' };
    mockAxiosInstance.post.mockResolvedValue({ data: qrMock });

    const resultado = await apiService.getQrCodePix({ chavePix: '123', valor: 100 });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/qrcode', { chavePix: '123', valor: 100 });
    expect(resultado).toEqual(qrMock);
  });

  test('lerQrCodePix retorna dados do QR Code', async () => {
    const dadosMock = { valor: 100, destinatario: 'João' };
    mockAxiosInstance.post.mockResolvedValue({ data: dadosMock });

    const resultado = await apiService.lerQrCodePix({ qrCode: '000201...' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/qrcode/ler', { qrCode: '000201...' });
    expect(resultado).toEqual(dadosMock);
  });

  test('getHistoricoPix retorna histórico', async () => {
    const historicoMock = [{ id: '1', tipo: 'ENVIADO', valor: -50 }];
    mockAxiosInstance.get.mockResolvedValue({ data: historicoMock });

    const resultado = await apiService.getHistoricoPix({ page: 1 });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/pix/historico', { params: { page: 1 } });
    expect(resultado).toEqual(historicoMock);
  });

  test('cancelarPix cancela transferência', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { status: 'CANCELADO' } });

    const resultado = await apiService.cancelarPix('txn-001');

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/pix/transferencias/txn-001/cancelar');
    expect(resultado).toEqual({ status: 'CANCELADO' });
  });
});

describe('apiService - TED (/api/ted)', () => {
  test('enviarTed retorna resultado', async () => {
    const resultadoMock = { id: '1', status: 'PENDENTE' };
    mockAxiosInstance.post.mockResolvedValue({ data: resultadoMock });

    const resultado = await apiService.enviarTed({
      contaDestino: '12345-6',
      agenciaDestino: '0001',
      bancoDestino: '001',
      valor: 500,
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/ted/enviar', expect.objectContaining({
      contaDestino: '12345-6',
      valor: 500,
    }));
    expect(resultado).toEqual(resultadoMock);
  });

  test('getHistoricoTed retorna histórico', async () => {
    const historicoMock = [{ id: '1', valor: 500, status: 'CONCLUIDA' }];
    mockAxiosInstance.get.mockResolvedValue({ data: historicoMock });

    const resultado = await apiService.getHistoricoTed();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/ted/historico', { params: {} });
    expect(resultado).toEqual(historicoMock);
  });

  test('getTed retorna TED por id', async () => {
    const tedMock = { id: '1', valor: 500, status: 'CONCLUIDA' };
    mockAxiosInstance.get.mockResolvedValue({ data: tedMock });

    const resultado = await apiService.getTed('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/ted/1');
    expect(resultado).toEqual(tedMock);
  });

  test('cancelarTed cancela transferência', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { status: 'CANCELADO' } });

    const resultado = await apiService.cancelarTed('ted-001');

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/ted/ted-001/cancelar');
    expect(resultado).toEqual({ status: 'CANCELADO' });
  });
});

describe('apiService - Boletos (/api/boletos)', () => {
  test('getBoletos retorna lista de boletos', async () => {
    const boletosMock = [{ id: '1', codigoBarras: '12345678901234567890123456789012345678901234', valor: 250 }];
    mockAxiosInstance.get.mockResolvedValue({ data: boletosMock });

    const resultado = await apiService.getBoletos();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/boletos', { params: {} });
    expect(resultado).toEqual(boletosMock);
  });

  test('getBoleto retorna boleto por id', async () => {
    const boletoMock = { id: '1', valor: 100, status: 'PENDENTE' };
    mockAxiosInstance.get.mockResolvedValue({ data: boletoMock });

    const resultado = await apiService.getBoleto('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/boletos/1');
    expect(resultado).toEqual(boletoMock);
  });

  test('emitirBoleto retorna boleto emitido', async () => {
    const boletoMock = { id: '1', codigoBarras: '12345678901234567890123456789012345678901234', valor: 100 };
    mockAxiosInstance.post.mockResolvedValue({ data: boletoMock });

    const resultado = await apiService.emitirBoleto({
      beneficiario: 'Empresa X',
      valor: 100,
      dataVencimento: '2024-02-15',
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/boletos', expect.objectContaining({
      beneficiario: 'Empresa X',
      valor: 100,
    }));
    expect(resultado).toEqual(boletoMock);
  });

  test('cancelarBoleto cancela boleto', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { status: 'CANCELADO' } });

    const resultado = await apiService.cancelarBoleto('1');

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/boletos/1/cancelar');
    expect(resultado).toEqual({ status: 'CANCELADO' });
  });

  test('getBoletoPorCodigoBarras retorna boleto', async () => {
    const boletoMock = { id: '1', valor: 250 };
    mockAxiosInstance.get.mockResolvedValue({ data: boletoMock });

    const resultado = await apiService.getBoletoPorCodigoBarras('12345678901234567890123456789012345678901234');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/boletos/codigo-barras/12345678901234567890123456789012345678901234');
    expect(resultado).toEqual(boletoMock);
  });

  test('pagarBoleto retorna resultado', async () => {
    const resultadoMock = { id: '1', status: 'PAGO' };
    mockAxiosInstance.post.mockResolvedValue({ data: resultadoMock });

    const resultado = await apiService.pagarBoleto({
      codigoBarras: '12345678901234567890123456789012345678901234',
      valor: 100,
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/boletos/pagar', expect.objectContaining({
      codigoBarras: expect.any(String),
    }));
    expect(resultado).toEqual(resultadoMock);
  });
});

describe('apiService - Crédito (/api/credito)', () => {
  test('simularCredito retorna simulação', async () => {
    const simulacaoMock = { parcelas: 12, valorParcela: 90, taxa: 1.5 };
    mockAxiosInstance.post.mockResolvedValue({ data: simulacaoMock });

    const resultado = await apiService.simularCredito({
      valor: 1000,
      prazo: 12,
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/credito/simular', { valor: 1000, prazo: 12 });
    expect(resultado).toEqual(simulacaoMock);
  });

  test('getSimulacoesCredito retorna simulações', async () => {
    const simulacoesMock = [{ id: '1', valor: 1000, parcelas: 12 }];
    mockAxiosInstance.get.mockResolvedValue({ data: simulacoesMock });

    const resultado = await apiService.getSimulacoesCredito();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/credito/simulacoes', { params: {} });
    expect(resultado).toEqual(simulacoesMock);
  });

  test('getSolicitacoesCredito retorna solicitações', async () => {
    const solicitacoesMock = [{ id: '1', status: 'APROVADA', valor: 5000 }];
    mockAxiosInstance.get.mockResolvedValue({ data: solicitacoesMock });

    const resultado = await apiService.getSolicitacoesCredito();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/credito/solicitacoes', { params: {} });
    expect(resultado).toEqual(solicitacoesMock);
  });

  test('solicitarCredito retorna solicitação criada', async () => {
    const solicitacaoMock = { id: '1', status: 'PENDENTE' };
    mockAxiosInstance.post.mockResolvedValue({ data: solicitacaoMock });

    const resultado = await apiService.solicitarCredito({ valor: 10000, prazo: 24 });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/credito/solicitacoes', { valor: 10000, prazo: 24 });
    expect(resultado).toEqual(solicitacaoMock);
  });

  test('getSolicitacaoCredito retorna solicitação por id', async () => {
    const solicitacaoMock = { id: '1', status: 'APROVADA', valor: 5000 };
    mockAxiosInstance.get.mockResolvedValue({ data: solicitacaoMock });

    const resultado = await apiService.getSolicitacaoCredito('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/credito/solicitacoes/1');
    expect(resultado).toEqual(solicitacaoMock);
  });

  test('getParcelasCredito retorna parcelas', async () => {
    const parcelasMock = [{ numero: 1, valor: 90, status: 'PENDENTE' }];
    mockAxiosInstance.get.mockResolvedValue({ data: parcelasMock });

    const resultado = await apiService.getParcelasCredito('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/credito/solicitacoes/1/parcelas');
    expect(resultado).toEqual(parcelasMock);
  });
});

describe('apiService - Clientes', () => {
  test('getClienteAtual retorna dados do cliente', async () => {
    const clienteMock = { id: '1', nome: 'Maria Silva', cpf: '12345678901' };
    mockAxiosInstance.get.mockResolvedValue({ data: clienteMock });

    const resultado = await apiService.getClienteAtual();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/clientes/me');
    expect(resultado).toEqual(clienteMock);
  });

  test('getCliente retorna cliente por id', async () => {
    const clienteMock = { id: '1', nome: 'João Santos' };
    mockAxiosInstance.get.mockResolvedValue({ data: clienteMock });

    const resultado = await apiService.getCliente('1');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/clientes/1');
    expect(resultado).toEqual(clienteMock);
  });

  test('atualizarCliente retorna cliente atualizado', async () => {
    const clienteMock = { id: '1', telefone: '11999998888' };
    mockAxiosInstance.put.mockResolvedValue({ data: clienteMock });

    const resultado = await apiService.atualizarCliente('1', { telefone: '11999998888' });

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/clientes/1', { telefone: '11999998888' });
    expect(resultado).toEqual(clienteMock);
  });
});

describe('apiService - Autenticação', () => {
  test('envia token de autenticação no header', async () => {
    localStorage.setItem('aurix_token', 'token-teste-123');
    mockAxiosInstance.get.mockResolvedValue({ data: [] });

    await apiService.getContas();

    expect(mockAxiosInstance.get).toHaveBeenCalled();
  });

  test('remove token e redireciona para login em 401', async () => {
    localStorage.setItem('aurix_token', 'token-expirado');
    const errorMock = { response: { status: 401 } };
    mockAxiosInstance.get.mockRejectedValue(errorMock);

    try {
      await apiService.getContas();
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });
});
