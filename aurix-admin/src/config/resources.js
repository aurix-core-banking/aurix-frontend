export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const BASE = {
  core: '/api/core',
  pix: '/api/pix',
  compliance: '/api/compliance',
  audit: '/api/audit',
  analytics: '/api/analytics',
  provisioning: '/api/provisioning',
  billing: '/api/billing',
  onboarding: '/api/onboarding/onboarding',
  onboarding_pf: '/api/onboarding/contas/pf',
  onboarding_pj: '/api/onboarding/contas',
  webhooks: '/api/webhooks',
  openfinance: '/api/openfinance',
  baas: '/api/baas',
  credit: '/api/credit',
  bacen: '/api/bacen',
  settlement: '/api/settlement',
  pricing: '/api/pricing',
  accounting: '/api/accounting',
  cartoes: '/api/cartoes',
  treasury: '/api/treasury',
  organization: '/api/customer',
};

export const RESOURCE_PATH = {
  clientes: { base: BASE.core, path: 'clientes' },
  contas: { base: BASE.core, path: 'contas' },
  transacoes: { base: BASE.core, path: 'transacoes' },
  investimentos: { base: BASE.core, path: 'investimentos' },
  pix: { base: BASE.pix, path: 'transacoes' },
  compliance: { base: BASE.compliance, path: 'registro' },
  auditoria: { base: BASE.audit, path: 'auditoria' },
  analytics: { base: BASE.analytics, path: 'relatorios' },
  instituicoes: { base: BASE.provisioning, path: 'instituicoes' },
  planos: { base: BASE.billing, path: 'planos' },
  solicitacoes_conta: { base: BASE.onboarding_pf, path: 'solicitacoes' },
  solicitacoes_pj: { base: BASE.onboarding_pj, path: 'pj' },
  produtos_credito: { base: BASE.credit, path: 'produtos' },
  solicitacoes_credito: { base: BASE.credit, path: 'solicitacoes' },
  parceiros: { base: BASE.baas, path: 'parceiros' },
  subcontas: { base: BASE.baas, path: 'custodia/subcontas' },
  relatorios_bacen: { base: BASE.bacen, path: 'relatorios' },
  tarifas: { base: BASE.pricing, path: 'tarifas' },
  cartoes: { base: BASE.cartoes, path: 'cartoes' },
  lancamentos: { base: BASE.accounting, path: 'lancamentos' },
  empresas: { base: '/api/banking', path: 'empresas' },
  funcionarios: { base: '/api/banking', path: 'funcionarios' },
};

export const getResourceUrl = (resource, id = null) => {
  const r = RESOURCE_PATH[resource];
  const base = r?.base || BASE.core;
  const path = r?.path || resource;
  const suffix = id ? `/${id}` : '';
  return `${API_URL}${base}/${path}${suffix}`;
};

export const getActionUrl = (resource, id, action) => {
  return `${getResourceUrl(resource, id)}/${action}`;
};
