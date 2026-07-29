export const TIPOS_PESSOA = [
  { id: 'FISICA', name: 'Física' },
  { id: 'JURIDICA', name: 'Jurídica' },
];

export const STATUS_CLIENTE = [
  { id: 'ATIVO', name: 'Ativo' },
  { id: 'INATIVO', name: 'Inativo' },
  { id: 'BLOQUEADO', name: 'Bloqueado' },
];

export const TIPOS_CONTA = [
  { id: 'CORRENTE', name: 'Corrente' },
  { id: 'POUPANCA', name: 'Poupança' },
  { id: 'INVESTIMENTO', name: 'Investimento' },
];

export const STATUS_CONTA = [
  { id: 'ATIVA', name: 'Ativa' },
  { id: 'INATIVA', name: 'Inativa' },
  { id: 'BLOQUEADA', name: 'Bloqueada' },
];

export const TIPOS_TRANSACAO = [
  { id: 'DEPOSITO', name: 'Depósito' },
  { id: 'SAQUE', name: 'Saque' },
  { id: 'TRANSFERENCIA', name: 'Transferência' },
  { id: 'PAGAMENTO', name: 'Pagamento' },
  { id: 'PIX', name: 'PIX' },
];

export const STATUS_TRANSACAO = [
  { id: 'PENDENTE', name: 'Pendente' },
  { id: 'PROCESSADA', name: 'Processada' },
  { id: 'CANCELADA', name: 'Cancelada' },
  { id: 'FALHADA', name: 'Falhada' },
];

export const TIPOS_INVESTIMENTO = [
  { id: 'CDB', name: 'CDB' },
  { id: 'LCI', name: 'LCI' },
  { id: 'LCA', name: 'LCA' },
  { id: 'TESOURO', name: 'Tesouro Direto' },
  { id: 'FUNDO', name: 'Fundo de Investimento' },
];

export const STATUS_INVESTIMENTO = [
  { id: 'ATIVO', name: 'Ativo' },
  { id: 'RESGATADO', name: 'Resgatado' },
  { id: 'VENCIDO', name: 'Vencido' },
];

export const TIPOS_CHAVE_PIX = [
  { id: 'CPF', name: 'CPF' },
  { id: 'CNPJ', name: 'CNPJ' },
  { id: 'EMAIL', name: 'E-mail' },
  { id: 'TELEFONE', name: 'Telefone' },
  { id: 'ALEATORIA', name: 'Aleatória' },
];

export const STATUS_PIX = [
  { id: 'ATIVA', name: 'Ativa' },
  { id: 'INATIVA', name: 'Inativa' },
  { id: 'BLOQUEADA', name: 'Bloqueada' },
];

export const TIPOS_REGULACAO = [
  { id: 'BACEN', name: 'BACEN' },
  { id: 'CVM', name: 'CVM' },
  { id: 'CADE', name: 'CADE' },
  { id: 'ANATEL', name: 'ANATEL' },
];

export const STATUS_COMPLIANCE = [
  { id: 'PENDENTE', name: 'Pendente' },
  { id: 'EM_ANALISE', name: 'Em Análise' },
  { id: 'APROVADO', name: 'Aprovado' },
  { id: 'REJEITADO', name: 'Rejeitado' },
];

export const TIPOS_ACAO_AUDITORIA = [
  { id: 'CREATE', name: 'Criar' },
  { id: 'UPDATE', name: 'Atualizar' },
  { id: 'DELETE', name: 'Deletar' },
  { id: 'LOGIN', name: 'Login' },
  { id: 'LOGOUT', name: 'Logout' },
];

export const NIVEIS_AUDITORIA = [
  { id: 'INFO', name: 'Info' },
  { id: 'WARN', name: 'Aviso' },
  { id: 'ERROR', name: 'Erro' },
  { id: 'CRITICAL', name: 'Crítico' },
];

export const TIPOS_METRICA = [
  { id: 'TRANSACOES', name: 'Transações' },
  { id: 'CLIENTES', name: 'Clientes' },
  { id: 'INVESTIMENTOS', name: 'Investimentos' },
  { id: 'PIX', name: 'PIX' },
  { id: 'COMPLIANCE', name: 'Compliance' },
];

export const PERIODOS_ANALYTICS = [
  { id: 'DIARIO', name: 'Diário' },
  { id: 'SEMANAL', name: 'Semanal' },
  { id: 'MENSAL', name: 'Mensal' },
  { id: 'ANUAL', name: 'Anual' },
];
