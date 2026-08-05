jest.mock('axios', () => {
  let requestInterceptors = [];
  let responseFulfilled = [];
  let responseRejected = [];

  function applyRequestInterceptors(config) {
    const cfg = config || {};
    if (!cfg.headers) cfg.headers = {};
    return requestInterceptors.reduce((c, fn) => fn(c) || c, cfg);
  }

  function applyResponseInterceptors(promise) {
    return promise.then(
      (value) => responseFulfilled.reduce((v, fn) => fn(v) || v, value),
      (error) => {
        let result = error;
        for (const fn of responseRejected) {
          try { return fn(result); } catch (e) { result = e; }
        }
        throw result;
      },
    );
  }

  function wrapMock(mockFn, configPos) {
    return new Proxy(mockFn, {
      apply(target, thisArg, args) {
        args = [...args];
        if (configPos > 0 && args.length < configPos) {
          while (args.length < configPos) args.push(undefined);
          args.push(applyRequestInterceptors({}));
        } else if (args.length === configPos) {
          args.push(applyRequestInterceptors({}));
        } else {
          args[configPos] = applyRequestInterceptors(args[configPos] || {});
        }
        const config = args[configPos];
        if (config.url === undefined) config.url = args[0];
        const promise = Reflect.apply(target, thisArg, args);
        return applyResponseInterceptors(
          Promise.resolve(promise).catch((error) => {
            if (error && !error.config) error.config = config;
            throw error;
          })
        );
      },
    });
  }

  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  const mockAxios = new Proxy(function mockAxios() {}, {
    get(_, prop) {
      if (prop === 'get') return wrapMock(mockGet, 1);
      if (prop === 'post') return wrapMock(mockPost, 2);
      if (prop === 'put') return wrapMock(mockPut, 2);
      if (prop === 'delete') return wrapMock(mockDelete, 1);
      if (prop === 'create') return jest.fn(() => mockAxios);
      if (prop === 'interceptors') {
        return {
          request: {
            use: jest.fn((fn) => { requestInterceptors.push(fn); }),
            eject: jest.fn(),
          },
          response: {
            use: jest.fn((onFulfilled, onRejected) => {
              if (onFulfilled) responseFulfilled.push(onFulfilled);
              if (onRejected) responseRejected.push(onRejected);
            }),
            eject: jest.fn(),
          },
        };
      }
      return undefined;
    },
    apply(_target, _thisArg, args) {
      const config = args[0] || {};
      const method = (config.method || 'get').toLowerCase();
      const callConfig = applyRequestInterceptors(config);
      let promise;
      if (method === 'get') promise = mockGet(callConfig.url, callConfig);
      else if (method === 'post') promise = mockPost(callConfig.url, callConfig.data, callConfig);
      else if (method === 'put') promise = mockPut(callConfig.url, callConfig.data, callConfig);
      else if (method === 'delete') promise = mockDelete(callConfig.url, callConfig);
      else promise = Promise.resolve({ data: {} });
      return applyResponseInterceptors(promise);
    },
  });

  return mockAxios;
});
import axios from 'axios';
import api from './apiService';

beforeEach(() => {
  localStorage.setItem('aurix_token', 'test-token');
});
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('getContas envia GET para /contas com token', async () => {
  axios.get.mockResolvedValue({ data: [{ id: '1' }] });
  const result = await api.getContas();
  expect(axios.get).toHaveBeenCalledWith('/contas', expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }));
  expect(result).toHaveLength(1);
});

test('enviarPix envia POST para /pix/enviar', async () => {
  axios.post.mockResolvedValue({ data: { id: '1' } });
  const payload = { chave: 'test@test.com', valor: 100 };
  await api.enviarPix(payload);
  expect(axios.post).toHaveBeenCalledWith('/pix/enviar', payload, expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }));
});

test('receberPix envia POST para /pix/receber', async () => {
  axios.post.mockResolvedValue({ data: { qrCode: 'base64...' } });
  await api.receberPix({ valor: 200 });
  expect(axios.post).toHaveBeenCalledWith('/pix/receber', { valor: 200 }, expect.any(Object));
});

test('getInvestimentos faz GET com contaId', async () => {
  axios.get.mockResolvedValue({ data: [] });
  await api.getInvestimentos('1');
  expect(axios.get).toHaveBeenCalledWith('/investimentos/conta/1', expect.any(Object));
});

test('emitirCartao envia POST para /cartoes/emitir', async () => {
  axios.post.mockResolvedValue({ data: { id: '1' } });
  await api.emitirCartao({ tipo: 'CREDITO', bandeira: 'Visa' });
  expect(axios.post).toHaveBeenCalledWith('/cartoes/emitir', { tipo: 'CREDITO', bandeira: 'Visa' }, expect.any(Object));
});

test('simularInvestimento envia POST para /investimentos/simular', async () => {
  axios.post.mockResolvedValue({ data: { valorLiquido: 11500 } });
  await api.simularInvestimento('CDB', 10000, 13.5, 360);
  expect(axios.post).toHaveBeenCalledWith('/investimentos/simular', { tipo: 'CDB', valorInvestido: 10000, taxaAnual: 13.5, dias: 360 }, expect.any(Object));
});

test('interceptor redireciona ao receber 401 e falhar refresh', async () => {
  delete window.location;
  window.location = { href: '' };
  axios.get.mockRejectedValue({ response: { status: 401 } });
  axios.post.mockRejectedValue({ response: { status: 401 } });
  await expect(api.getContas()).rejects.toMatchObject({ response: { status: 401 } });
  expect(localStorage.getItem('aurix_token')).toBeNull();
  expect(window.location.href).toBe('/login');
});

test('interceptor renova token e reexecuta request ao receber 401', async () => {
  delete window.location;
  window.location = { href: '' };
  localStorage.setItem('aurix_refresh_token', 'refresh-token');
  axios.get.mockRejectedValueOnce({ response: { status: 401 } })
    .mockResolvedValueOnce({ data: [{ id: '1' }] });
  axios.post.mockResolvedValue({ data: { token: 'new-token', refreshToken: 'new-refresh' } });
  const result = await api.getContas();
  expect(result).toHaveLength(1);
  expect(axios.post).toHaveBeenCalledWith('/auth/refresh', {}, expect.any(Object));
  expect(localStorage.getItem('aurix_token')).toBe('new-token');
  expect(localStorage.getItem('aurix_refresh_token')).toBe('new-refresh');
});

describe('Onboarding API', () => {
  const data = { cpf: '12345678901', nome: 'Teste', email: 'teste@test.com' };
  const socio = { cpf: '98765432100', nome: 'Socio', tipo: 'SOCIO' };
  const doc = { tipoDocumento: 'CONTRATO_SOCIAL', nomeArquivo: 'contrato.pdf', urlStorage: 'https://storage.com/doc.pdf' };

  test('criarSolicitacaoPF', async () => {
    axios.post.mockResolvedValue({ data: { id: 1 } });
    const res = await api.criarSolicitacaoPF(data);
    expect(axios.post).toHaveBeenCalledWith('/onboarding/contas/pf/solicitacoes', data, expect.any(Object));
    expect(res.id).toBe(1);
  });

  test('getSolicitacaoPF', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, status: 'EM_ANALISE' } });
    const res = await api.getSolicitacaoPF(1);
    expect(axios.get).toHaveBeenCalledWith('/onboarding/contas/pf/solicitacoes/1', expect.any(Object));
    expect(res.status).toBe('EM_ANALISE');
  });

  test('criarSolicitacaoPJ', async () => {
    axios.post.mockResolvedValue({ data: { id: 10, cnpj: '12345678000190' } });
    const res = await api.criarSolicitacaoPJ(data);
    expect(axios.post).toHaveBeenCalledWith('/onboarding/contas/pj', data, expect.any(Object));
    expect(res.id).toBe(10);
  });

  test('getSolicitacaoPJ', async () => {
    axios.get.mockResolvedValue({ data: { id: 10, status: 'EM_PREENCHIMENTO' } });
    const res = await api.getSolicitacaoPJ(10);
    expect(axios.get).toHaveBeenCalledWith('/onboarding/contas/pj/10', expect.any(Object));
    expect(res.status).toBe('EM_PREENCHIMENTO');
  });

  test('validarCNPJPJ', async () => {
    axios.post.mockResolvedValue({ data: { id: 10, status: 'CNPJ_CONSULTADO' } });
    const res = await api.validarCNPJPJ(10);
    expect(axios.post).toHaveBeenCalledWith('/onboarding/contas/pj/10/validar-cnpj', undefined, expect.any(Object));
    expect(res.status).toBe('CNPJ_CONSULTADO');
  });

  test('adicionarSocioPJ', async () => {
    axios.post.mockResolvedValue({});
    await api.adicionarSocioPJ(10, socio);
    expect(axios.post).toHaveBeenCalledWith('/onboarding/contas/pj/10/socios', socio, expect.any(Object));
  });

  test('removerSocioPJ', async () => {
    axios.delete.mockResolvedValue({});
    await api.removerSocioPJ(10, 5);
    expect(axios.delete).toHaveBeenCalledWith('/onboarding/contas/pj/10/socios/5', expect.any(Object));
  });

  test('adicionarDocumentoPJ', async () => {
    axios.post.mockResolvedValue({});
    await api.adicionarDocumentoPJ(10, doc);
    expect(axios.post).toHaveBeenCalledWith('/onboarding/contas/pj/10/documentos', doc, expect.any(Object));
  });
});
