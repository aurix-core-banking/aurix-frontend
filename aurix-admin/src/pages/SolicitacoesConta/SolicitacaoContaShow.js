import React from 'react';
import {
  Show, TabbedShowLayout, Tab, TextField, DateField, NumberField,
  BooleanField, useRecordContext, useRefresh,
} from 'react-admin';
import { Box } from '@mui/material';
import { StatusTimeline } from '../../components/StatusTimeline';
import { DocumentList } from '../../components/DocumentList';
import { WorkflowActionsPF } from '../../components/WorkflowActionsPF';

const PF_STATUS_ORDER = [
  'RECEBIDA', 'DOCUMENTOS_PENDENTES', 'EM_ANALISE_KYC',
  'KYC_APROVADO', 'KYC_REJEITADO', 'APROVADA', 'CONTA_CRIADA', 'REJEITADA',
];

const PF_STATUS_LABELS = {
  RECEBIDA: 'Recebida',
  DOCUMENTOS_PENDENTES: 'Documentos Pendentes',
  EM_ANALISE_KYC: 'Em Análise KYC',
  KYC_APROVADO: 'KYC Aprovado',
  KYC_REJEITADO: 'KYC Rejeitado',
  APROVADA: 'Aprovada',
  CONTA_CRIADA: 'Conta Criada',
  REJEITADA: 'Rejeitada',
};

const DetailsTab = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box sx={{ p: 2 }}>
      <TextField source="id" label="ID" />
      <TextField source="cpf" label="CPF" />
      <TextField source="nome" label="Nome" />
      <TextField source="email" label="Email" />
      <TextField source="telefone" label="Telefone" />
      <TextField source="dataNascimento" label="Data de Nascimento" />
      <TextField source="ocupacao" label="Ocupação" />
      <NumberField source="rendaDeclarada" label="Renda Declarada" options={{ style: 'currency', currency: 'BRL' }} emptyText="-" />
      <TextField source="status" label="Status" />
      <BooleanField source="pep" label="PEP" looseValue />
      <NumberField source="scoreBureau" label="Score Bureau" emptyText="-" />
      <TextField source="resultadoKyc" label="Resultado KYC" emptyText="-" />
      <NumberField source="clienteIdCriado" label="Cliente ID" emptyText="-" />
      <NumberField source="contaIdCriada" label="Conta ID" emptyText="-" />
      <BooleanField source="contaLimitadaAteKyc" label="Conta Limitada até KYC" looseValue />
      <TextField source="observacoesAnalista" label="Observações" emptyText="-" />
      <DateField source="dataCriacao" label="Criado em" showTime />
      <DateField source="dataAtualizacao" label="Atualizado em" showTime />
    </Box>
  );
};

const DocumentosTab = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  if (!record) return null;
  return (
    <DocumentList
      documentos={record.documentos || []}
      solicitacaoId={record.id}
      onRefresh={refresh}
      resourceName="solicitacoes_conta"
    />
  );
};

const HistoricoTab = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <StatusTimeline
      historico={record.historico || []}
      statusAtual={record.status}
      statusOrder={PF_STATUS_ORDER}
      statusLabels={PF_STATUS_LABELS}
    />
  );
};

const AcoesTab = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  if (!record) return null;
  return (
    <WorkflowActionsPF
      solicitacaoId={record.id}
      statusAtual={record.status}
      onRefresh={refresh}
    />
  );
};

export const SolicitacaoContaShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Detalhes">
        <DetailsTab />
      </Tab>
      <Tab label="Documentos" path="documentos">
        <DocumentosTab />
      </Tab>
      <Tab label="Histórico" path="historico">
        <HistoricoTab />
      </Tab>
      <Tab label="Ações" path="acoes">
        <AcoesTab />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
