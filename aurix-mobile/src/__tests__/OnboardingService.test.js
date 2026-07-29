import MockAdapter from 'axios-mock-adapter';
import { onboardingService } from '../services/onboardingService';

const mockAxios = new MockAdapter(onboardingService.api);

describe('onboardingService', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('criarSolicitacaoPF posts to correct endpoint and returns data', async () => {
    const dados = { cpf: '12345678901', nome: 'João' };
    const resposta = { id: 1, protocolo: 'PROTO-001', status: 'RECEBIDA' };
    mockAxios.onPost('/onboarding/contas/pf/solicitacoes').reply(201, resposta);

    const result = await onboardingService.criarSolicitacaoPF(dados);

    expect(result).toEqual(resposta);
    expect(mockAxios.history.post[0].url).toBe('/onboarding/contas/pf/solicitacoes');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(dados);
  });

  it('criarSolicitacaoPJ posts to correct endpoint and returns data', async () => {
    const dados = { cnpj: '11222333000181', razaoSocial: 'Empresa Ltda', socios: [] };
    const resposta = { id: 2, protocolo: 'PROTO-002', status: 'RECEBIDA' };
    mockAxios.onPost('/onboarding/contas/pj').reply(201, resposta);

    const result = await onboardingService.criarSolicitacaoPJ(dados);

    expect(result).toEqual(resposta);
  });

  it('consultarStatus fetches PF solicitation by id', async () => {
    const resposta = { id: 1, protocolo: 'PROTO-001', status: 'EM_ANALISE' };
    mockAxios.onGet('/onboarding/contas/pf/solicitacoes/1').reply(200, resposta);

    const result = await onboardingService.consultarStatus(1, 'PF');

    expect(result).toEqual(resposta);
  });

  it('consultarStatus fetches PJ solicitation by id', async () => {
    const resposta = { id: 2, protocolo: 'PROTO-002', status: 'EM_ANALISE' };
    mockAxios.onGet('/onboarding/contas/pj/2').reply(200, resposta);

    const result = await onboardingService.consultarStatus(2, 'PJ');

    expect(result).toEqual(resposta);
  });

  it('throws error on network failure', async () => {
    mockAxios.onPost('/onboarding/contas/pf/solicitacoes').networkError();

    await expect(onboardingService.criarSolicitacaoPF({})).rejects.toThrow();
  });
});
