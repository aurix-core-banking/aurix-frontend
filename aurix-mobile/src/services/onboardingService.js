import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class OnboardingService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async criarSolicitacaoPF(dados) {
    const response = await this.api.post('/onboarding/contas/pf/solicitacoes', dados);
    return response.data;
  }

  async criarSolicitacaoPJ(dados) {
    const response = await this.api.post('/onboarding/contas/pj', dados);
    return response.data;
  }

  async consultarStatus(id, tipo = 'PF') {
    const path = tipo === 'PF'
      ? `/onboarding/contas/pf/solicitacoes/${id}`
      : `/onboarding/contas/pj/${id}`;
    const response = await this.api.get(path);
    return response.data;
  }

  async uploadDocumento(solicitacaoId, tipoDocumento, nomeArquivo, urlStorage, tipoPessoa) {
    const basePath = tipoPessoa === 'PF'
      ? '/onboarding/contas/pf/solicitacoes'
      : '/onboarding/contas/pj';
    const response = await this.api.post(`${basePath}/${solicitacaoId}/documentos`, {
      tipoDocumento,
      nomeArquivo,
      urlStorage,
    });
    return response.data;
  }
}

export const onboardingService = new OnboardingService();
