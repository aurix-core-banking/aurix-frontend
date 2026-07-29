// Configuração de exemplo para o Aurix Admin
// Copie este arquivo para config.js e ajuste as configurações

export const config = {
  // URL da API do Backend
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  
  // Configurações de Desenvolvimento
  debug: process.env.REACT_APP_DEBUG === 'true',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Configurações de Tema
  defaultTheme: process.env.REACT_APP_DEFAULT_THEME || 'light',
  
  // Configurações de Notificações
  notificationDuration: parseInt(process.env.REACT_APP_NOTIFICATION_DURATION) || 6000,
  
  // Configurações de Paginação
  defaultPageSize: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 25,
  maxPageSize: parseInt(process.env.REACT_APP_MAX_PAGE_SIZE) || 100,
  
  // Configurações de Exportação
  exportLimit: parseInt(process.env.REACT_APP_EXPORT_LIMIT) || 10000,
  
  // Configurações de Cache
  cacheDuration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 300000,
  
  // Configurações de Recursos
  resources: {
    clientes: {
      name: 'clientes',
      label: 'Clientes',
      icon: 'Person',
    },
    contas: {
      name: 'contas',
      label: 'Contas',
      icon: 'AccountBalance',
    },
    transacoes: {
      name: 'transacoes',
      label: 'Transações',
      icon: 'Payment',
    },
    investimentos: {
      name: 'investimentos',
      label: 'Investimentos',
      icon: 'TrendingUp',
    },
    pix: {
      name: 'pix',
      label: 'PIX',
      icon: 'Payment',
    },
    compliance: {
      name: 'compliance',
      label: 'Compliance',
      icon: 'Security',
    },
    auditoria: {
      name: 'auditoria',
      label: 'Auditoria',
      icon: 'Security',
    },
    analytics: {
      name: 'analytics',
      label: 'Analytics',
      icon: 'Assessment',
    },
  },
  
  // Configurações de Permissões
  permissions: {
    admin: ['*'],
    manager: ['clientes', 'contas', 'transacoes', 'investimentos', 'pix'],
    operator: ['clientes', 'contas', 'transacoes'],
    viewer: ['clientes', 'contas', 'transacoes', 'investimentos', 'pix', 'compliance', 'auditoria', 'analytics'],
  },
  
  // Configurações de Validação
  validation: {
    cpf: {
      required: true,
      message: 'CPF inválido',
    },
    cnpj: {
      required: true,
      message: 'CNPJ inválido',
    },
    email: {
      required: true,
      message: 'E-mail inválido',
    },
    phone: {
      required: false,
      message: 'Telefone inválido',
    },
  },
  
  // Configurações de Formatação
  formatting: {
    currency: {
      locale: 'pt-BR',
      currency: 'BRL',
    },
    date: {
      locale: 'pt-BR',
      format: 'dd/MM/yyyy',
    },
    datetime: {
      locale: 'pt-BR',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
  },
};
