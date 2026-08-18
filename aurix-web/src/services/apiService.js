import axios from 'axios';
import { instalarInterceptorRefresh } from './refreshTokenInterceptor';

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
      localStorage.removeItem('aurix_refresh_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

instalarInterceptorRefresh(api);

export const apiService = {
  async get(url, config) {
    const response = await api.get(url, config);
    return response.data;
  },

  async post(url, data, config) {
    const response = await api.post(url, data, config);
    return response.data;
  },

  async put(url, data, config) {
    const response = await api.put(url, data, config);
    return response.data;
  },

  async delete(url, config) {
    const response = await api.delete(url, config);
    return response.data;
  },

  async getContas() {
    const response = await api.get('/api/contas');
    return response.data;
  },

  async getConta(id) {
    const response = await api.get(`/api/contas/${id}`);
    return response.data;
  },

  async getExtratoConta(contaId, params = {}) {
    const response = await api.get(`/api/contas/${contaId}/extrato`, { params });
    return response.data;
  },

  async criarConta(contaData) {
    const response = await api.post('/api/contas', contaData);
    return response.data;
  },

  async atualizarConta(id, dados) {
    const response = await api.put(`/api/contas/${id}`, dados);
    return response.data;
  },

  async getTransacoes(contaId, params = {}) {
    const response = await api.get('/api/transacoes', {
      params: { contaId, ...params },
    });
    return response.data;
  },

  async criarTransacao(transacao) {
    const response = await api.post('/api/transacoes', transacao);
    return response.data;
  },

  async getTransacao(id) {
    const response = await api.get(`/api/transacoes/${id}`);
    return response.data;
  },

  async getTransacoesPeriodo(contaId, dataInicio, dataFim) {
    const response = await api.get('/api/transacoes', {
      params: { contaId, dataInicio, dataFim },
    });
    return response.data;
  },

  async enviarPix(pixData) {
    const response = await api.post('/api/pix/transferencias', pixData);
    return response.data;
  },

  async receberPix(pixData) {
    const response = await api.post('/api/pix/receber', pixData);
    return response.data;
  },

  async getChavesPix() {
    const response = await api.get('/api/pix/chaves');
    return response.data;
  },

  async criarChavePix(chaveData) {
    const response = await api.post('/api/pix/chaves', chaveData);
    return response.data;
  },

  async deletarChavePix(id) {
    const response = await api.delete(`/api/pix/chaves/${id}`);
    return response.data;
  },

  async getQrCodePix(pixData) {
    const response = await api.post('/api/pix/qrcode', pixData);
    return response.data;
  },

  async lerQrCodePix(qrCodeData) {
    const response = await api.post('/api/pix/qrcode/ler', qrCodeData);
    return response.data;
  },

  async getHistoricoPix(params = {}) {
    const response = await api.get('/api/pix/historico', { params });
    return response.data;
  },

  async cancelarPix(id) {
    const response = await api.post(`/api/pix/transferencias/${id}/cancelar`);
    return response.data;
  },

  async enviarTed(tedData) {
    const response = await api.post('/api/ted/enviar', tedData);
    return response.data;
  },

  async getHistoricoTed(params = {}) {
    const response = await api.get('/api/ted/historico', { params });
    return response.data;
  },

  async getTed(id) {
    const response = await api.get(`/api/ted/${id}`);
    return response.data;
  },

  async cancelarTed(id) {
    const response = await api.post(`/api/ted/${id}/cancelar`);
    return response.data;
  },

  async getBoletos(params = {}) {
    const response = await api.get('/api/boletos', { params });
    return response.data;
  },

  async getBoleto(id) {
    const response = await api.get(`/api/boletos/${id}`);
    return response.data;
  },

  async emitirBoleto(boletoData) {
    const response = await api.post('/api/boletos', boletoData);
    return response.data;
  },

  async cancelarBoleto(id) {
    const response = await api.post(`/api/boletos/${id}/cancelar`);
    return response.data;
  },

  async getBoletoPorCodigoBarras(codigoBarras) {
    const response = await api.get(`/api/boletos/codigo-barras/${codigoBarras}`);
    return response.data;
  },

  async pagarBoleto(pagamentoData) {
    const response = await api.post('/api/boletos/pagar', pagamentoData);
    return response.data;
  },

  async getSimulacoesCredito(params = {}) {
    const response = await api.get('/api/credito/simulacoes', { params });
    return response.data;
  },

  async simularCredito(simulacaoData) {
    const response = await api.post('/api/credito/simular', simulacaoData);
    return response.data;
  },

  async getSolicitacoesCredito(params = {}) {
    const response = await api.get('/api/credito/solicitacoes', { params });
    return response.data;
  },

  async solicitarCredito(solicitacaoData) {
    const response = await api.post('/api/credito/solicitacoes', solicitacaoData);
    return response.data;
  },

  async getSolicitacaoCredito(id) {
    const response = await api.get(`/api/credito/solicitacoes/${id}`);
    return response.data;
  },

  async getParcelasCredito(solicitacaoId) {
    const response = await api.get(`/api/credito/solicitacoes/${solicitacaoId}/parcelas`);
    return response.data;
  },

  async getInvestimentos(contaId) {
    const response = await api.get(`/api/poupanca/contas/${contaId}`);
    return response.data;
  },

  async criarInvestimento(investimento) {
    const response = await api.post('/api/poupanca/contas', investimento);
    return response.data;
  },

  async simularInvestimento(tipo, valor, taxa, dias) {
    const response = await api.post('/api/poupanca/simular', {
      tipo,
      valorInvestido: valor,
      taxaAnual: taxa,
      dias,
    });
    return response.data;
  },

  async getCartoes(contaId) {
    const response = await api.get(`/api/cards/consulta/${contaId}`);
    return response.data;
  },

  async emitirCartao(cartaoData) {
    const response = await api.post('/api/cards/emissao', cartaoData);
    return response.data;
  },

  async getFaturas(cartaoId) {
    const response = await api.get(`/api/cards/faturas/${cartaoId}`);
    return response.data;
  },

  async pagarFatura(faturaId, valor) {
    const response = await api.post(`/api/cards/faturas/${faturaId}/pagar`, {
      valorPagamento: valor,
    });
    return response.data;
  },

  async getClienteAtual() {
    const response = await api.get('/api/clientes/me');
    return response.data;
  },

  async getCliente(id) {
    const response = await api.get(`/api/clientes/${id}`);
    return response.data;
  },

  async atualizarCliente(id, dados) {
    const response = await api.put(`/api/clientes/${id}`, dados);
    return response.data;
  },

  async criarSolicitacaoPF(data) {
    const response = await api.post('/api/onboarding/contas/pf/solicitacoes', data);
    return response.data;
  },

  async getSolicitacaoPF(id) {
    const response = await api.get(`/api/onboarding/contas/pf/solicitacoes/${id}`);
    return response.data;
  },

  async criarSolicitacaoPJ(data) {
    const response = await api.post('/api/onboarding/contas/pj', data);
    return response.data;
  },

  async getSolicitacaoPJ(id) {
    const response = await api.get(`/api/onboarding/contas/pj/${id}`);
    return response.data;
  },

  async validarCNPJPJ(id) {
    const response = await api.post(`/api/onboarding/contas/pj/${id}/validar-cnpj`);
    return response.data;
  },

  async adicionarSocioPJ(id, socio) {
    await api.post(`/api/onboarding/contas/pj/${id}/socios`, socio);
  },

  async removerSocioPJ(id, socioId) {
    await api.delete(`/api/onboarding/contas/pj/${id}/socios/${socioId}`);
  },

  async adicionarDocumentoPJ(id, doc) {
    await api.post(`/api/onboarding/contas/pj/${id}/documentos`, doc);
  },

  async atualizarUsuario(data) {
    const response = await api.put('/api/usuarios/me', data);
    return response.data;
  },

  async atualizarConfiguracoes(data) {
    const response = await api.put('/api/usuarios/me/configuracoes', data);
    return response.data;
  },
};

export default apiService;
