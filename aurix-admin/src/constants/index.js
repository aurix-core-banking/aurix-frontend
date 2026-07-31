export const TIPOS_PESSOA = [
  { id: 'FISICA', name: 'Física' },
  { id: 'JURIDICA', name: 'Jurídica' },
];

export const STATUS_CLIENTE = [
  { id: 'ATIVO', name: 'Ativo' },
  { id: 'INATIVO', name: 'Inativo' },
  { id: 'BLOQUEADO', name: 'Bloqueado' },
  { id: 'SUSPENSO', name: 'Suspenso' },
];

export const TIPOS_CONTA = [
  { id: 'CORRENTE', name: 'Corrente' },
  { id: 'POUPANCA', name: 'Poupança' },
  { id: 'SALARIO', name: 'Salário' },
  { id: 'EMPRESARIAL', name: 'Empresarial' },
];

export const STATUS_CONTA = [
  { id: 'ATIVA', name: 'Ativa' },
  { id: 'INATIVA', name: 'Inativa' },
  { id: 'BLOQUEADA', name: 'Bloqueada' },
  { id: 'SUSPENSA', name: 'Suspensa' },
  { id: 'FECHADA', name: 'Fechada' },
];

export const TIPOS_TRANSACAO = [
  { id: 'PIX', name: 'PIX' },
  { id: 'TED', name: 'TED' },
  { id: 'DOC', name: 'DOC' },
  { id: 'SAQUE', name: 'Saque' },
  { id: 'DEPOSITO', name: 'Depósito' },
  { id: 'TRANSFERENCIA_INTERNA', name: 'Transferência Interna' },
  { id: 'PAGAMENTO_BOLETO', name: 'Pagamento de Boleto' },
  { id: 'PAGAMENTO_CARTAO', name: 'Pagamento de Cartão' },
];

export const STATUS_TRANSACAO = [
  { id: 'PENDENTE', name: 'Pendente' },
  { id: 'PROCESSADA', name: 'Processada' },
  { id: 'CANCELADA', name: 'Cancelada' },
  { id: 'FALHADA', name: 'Falhada' },
  { id: 'REVERTIDA', name: 'Revertida' },
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
  { id: 'LEI', name: 'Lei' },
  { id: 'DECRETO', name: 'Decreto' },
  { id: 'RESOLUCAO', name: 'Resolução' },
  { id: 'CIRCULAR', name: 'Circular' },
  { id: 'INSTRUCAO', name: 'Instrução' },
  { id: 'PORTARIA', name: 'Portaria' },
];

export const STATUS_COMPLIANCE = [
  { id: 'EM_ANALISE', name: 'Em Análise' },
  { id: 'CONFORME', name: 'Conforme' },
  { id: 'NAO_CONFORME', name: 'Não Conforme' },
  { id: 'NAO_CONFORME_CRITICO', name: 'Não Conforme Crítico' },
  { id: 'PENDENTE_CORRECAO', name: 'Pendente Correção' },
  { id: 'CORRIGIDO', name: 'Corrigido' },
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
