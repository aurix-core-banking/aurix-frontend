import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aurix_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async getContas() {
    const response = await api.get('/contas');
    return response.data;
  },

  async getConta(id) {
    const response = await api.get(`/contas/${id}`);
    return response.data;
  },

  async getTransacoes(contaId, params = {}) {
    const response = await api.get(`/transacoes`, {
      params: { contaId, ...params },
    });
    return response.data;
  },

  async criarTransacao(transacao) {
    const response = await api.post('/transacoes', transacao);
    return response.data;
  },

  async enviarPix(pixData) {
    const response = await api.post('/pix/enviar', pixData);
    return response.data;
  },

  async receberPix(pixData) {
    const response = await api.post('/pix/receber', pixData);
    return response.data;
  },

  async getInvestimentos(contaId) {
    const response = await api.get('/investimentos/conta/' + contaId);
    return response.data;
  },

  async criarInvestimento(investimento) {
    const response = await api.post('/investimentos', investimento);
    return response.data;
  },

  async simularInvestimento(tipo, valor, taxa, dias) {
    const response = await api.post('/investimentos/simular', {
      tipo,
      valorInvestido: valor,
      taxaAnual: taxa,
      dias,
    });
    return response.data;
  },

  async getCartoes(contaId) {
    const response = await api.get(`/cartoes/conta/${contaId}`);
    return response.data;
  },

  async emitirCartao(cartaoData) {
    const response = await api.post('/cartoes/emitir', cartaoData);
    return response.data;
  },

  async getFaturas(cartaoId) {
    const response = await api.get(`/cartoes/${cartaoId}/faturas`);
    return response.data;
  },

  async pagarFatura(faturaId, valor) {
    const response = await api.post(`/cartoes/fatura/${faturaId}/pagar`, {
      valorPagamento: valor,
    });
    return response.data;
  },

  async criarSolicitacaoPF(data) {
    const response = await api.post('/onboarding/contas/pf/solicitacoes', data);
    return response.data;
  },

  async getSolicitacaoPF(id) {
    const response = await api.get(`/onboarding/contas/pf/solicitacoes/${id}`);
    return response.data;
  },

  async criarSolicitacaoPJ(data) {
    const response = await api.post('/onboarding/contas/pj', data);
    return response.data;
  },

  async getSolicitacaoPJ(id) {
    const response = await api.get(`/onboarding/contas/pj/${id}`);
    return response.data;
  },

  async validarCNPJPJ(id) {
    const response = await api.post(`/onboarding/contas/pj/${id}/validar-cnpj`);
    return response.data;
  },

  async adicionarSocioPJ(id, socio) {
    await api.post(`/onboarding/contas/pj/${id}/socios`, socio);
  },

  async removerSocioPJ(id, socioId) {
    await api.delete(`/onboarding/contas/pj/${id}/socios/${socioId}`);
  },

  async adicionarDocumentoPJ(id, doc) {
    await api.post(`/onboarding/contas/pj/${id}/documentos`, doc);
  },
};

export default apiService;
