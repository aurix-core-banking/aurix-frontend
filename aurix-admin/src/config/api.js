export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    CLIENTES: '/clientes',
    CONTAS: '/contas',
    TRANSACOES: '/transacoes',
    INVESTIMENTOS: '/investimentos',
    PIX: '/pix',
    COMPLIANCE: '/compliance',
    AUDITORIA: '/auditoria',
    ANALYTICS: '/analytics',
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
