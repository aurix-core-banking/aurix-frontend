import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('aurix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('aurix_token');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getContas: () => api.get('/contas').then(r => r.data),
  getConta: (id) => api.get(`/contas/${id}`).then(r => r.data),
  getTransacoes: (contaId, params) => api.get('/transacoes', { params: { contaId, ...params } }).then(r => r.data),
  criarTransacao: (data) => api.post('/transacoes', data).then(r => r.data),

  enviarPix: (data) => api.post('/pix/enviar', data).then(r => r.data),
  receberPix: (data) => api.post('/pix/receber', data).then(r => r.data),
  getChavesPix: () => api.get('/pix/chaves').then(r => r.data),
  criarChavePix: (data) => api.post('/pix/chaves', data).then(r => r.data),
  deletarChavePix: (id) => api.delete(`/pix/chaves/${id}`).then(r => r.data),

  getCartoes: (contaId) => api.get(`/cartoes/conta/${contaId}`).then(r => r.data),
  emitirCartao: (data) => api.post('/cartoes/emitir', data).then(r => r.data),
  getFaturas: (cartaoId) => api.get(`/cartoes/${cartaoId}/faturas`).then(r => r.data),
  pagarFatura: (faturaId, valor) => api.post(`/cartoes/fatura/${faturaId}/pagar`, { valorPagamento: valor }).then(r => r.data),

  getInvestimentos: (contaId) => api.get(`/investimentos/conta/${contaId}`).then(r => r.data),
  criarInvestimento: (data) => api.post('/investimentos', data).then(r => r.data),
  simularInvestimento: (tipo, valor, taxa, dias) => api.post('/investimentos/simular', { tipo, valorInvestido: valor, taxaAnual: taxa, dias }).then(r => r.data),

  fazerTransferencia: (data) => api.post('/transacoes/transferir', data).then(r => r.data),

  getPerfil: () => api.get('/usuarios/me').then(r => r.data),
  atualizarPerfil: (data) => api.put('/usuarios/me', data).then(r => r.data),
  alterarSenha: (data) => api.put('/usuarios/me/senha', data).then(r => r.data),

  getNotificacoes: () => api.get('/notificacoes').then(r => r.data),
  marcarNotificacaoLida: (id) => api.put(`/notificacoes/${id}/lida`).then(r => r.data),

  getConfiguracoes: () => api.get('/usuarios/me/configuracoes').then(r => r.data),
  atualizarConfiguracoes: (data) => api.put('/usuarios/me/configuracoes', data).then(r => r.data),

  getExtrato: (contaId, params) => api.get(`/contas/${contaId}/extrato`, { params }).then(r => r.data),
};

export default apiService;