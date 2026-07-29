import React from 'react';
import {
  List, Datagrid, TextField, DateField, ShowButton,
  Filter, SelectInput, SearchInput, TopToolbar, ExportButton,
} from 'react-admin';
import { BulkApproveReject } from '../../components/BulkApproveReject';

const STATUS_CHOICES = [
  { id: 'RECEBIDA', name: 'Recebida' },
  { id: 'DOCUMENTOS_PENDENTES', name: 'Documentos Pendentes' },
  { id: 'EM_ANALISE_KYC', name: 'Em Análise KYC' },
  { id: 'KYC_APROVADO', name: 'KYC Aprovado' },
  { id: 'KYC_REJEITADO', name: 'KYC Rejeitado' },
  { id: 'APROVADA', name: 'Aprovada' },
  { id: 'CONTA_CRIADA', name: 'Conta Criada' },
  { id: 'REJEITADA', name: 'Rejeitada' },
];

const FilterBar = (props) => (
  <Filter {...props}>
    <SearchInput source="cpf" alwaysOn />
    <SelectInput source="status" choices={STATUS_CHOICES} />
  </Filter>
);

export const SolicitacaoContaList = (props) => (
  <List {...props} filters={<FilterBar />} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid bulkActionButtons={<BulkApproveReject resourceName="solicitacoes_conta" />}>
      <TextField source="id" label="ID" />
      <TextField source="cpf" label="CPF" />
      <TextField source="nome" label="Nome" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
