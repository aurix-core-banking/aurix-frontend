import React from 'react';
import {
  Show, TabbedShowLayout, Tab, TextField, DateField, NumberField,
  useRecordContext, useRefresh,
} from 'react-admin';
import { Box } from '@mui/material';
import { StatusTimeline } from '../../components/StatusTimeline';
import { DocumentList } from '../../components/DocumentList';
import { SocioList } from '../../components/SocioList';
import { WorkflowActions } from '../../components/WorkflowActions';

const DetailsTab = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box sx={{ p: 2 }}>
      <TextField source="id" label="ID" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="razaoSocial" label="Razão Social" />
      <TextField source="nomeFantasia" label="Nome Fantasia" />
      <TextField source="email" label="Email" />
      <TextField source="telefone" label="Telefone" />
      <TextField source="status" label="Status" />
      <NumberField source="clienteIdCriado" label="Cliente ID" emptyText="-" />
      <NumberField source="contaIdCriada" label="Conta ID" emptyText="-" />
      <TextField source="observacoesAnalista" label="Observações" emptyText="-" />
      <DateField source="dataCriacao" label="Criado em" showTime />
      <DateField source="dataAtualizacao" label="Atualizado em" showTime />
    </Box>
  );
};

const SociosTab = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  if (!record) return null;
  return <SocioList socios={record.socios || []} solicitacaoId={record.id} onRefresh={refresh} />;
};

const DocumentosTab = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  if (!record) return null;
  return <DocumentList documentos={record.documentos || []} solicitacaoId={record.id} onRefresh={refresh} />;
};

const HistoricoTab = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <StatusTimeline historico={record.historico || []} statusAtual={record.status} />;
};

const AcoesTab = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  if (!record) return null;
  return (
    <WorkflowActions
      solicitacaoId={record.id}
      statusAtual={record.status}
      onRefresh={refresh}
    />
  );
};

export const SolicitacaoPJShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Detalhes">
        <DetailsTab />
      </Tab>
      <Tab label="Sócios" path="socios">
        <SociosTab />
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
