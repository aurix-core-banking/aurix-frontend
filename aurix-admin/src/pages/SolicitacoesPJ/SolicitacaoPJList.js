import React from 'react';
import {
  List, Datagrid, TextField, DateField, ShowButton,
  Filter, SelectInput, SearchInput, TopToolbar, ExportButton,
} from 'react-admin';
import { BulkApproveReject } from '../../components/BulkApproveReject';

const STATUS_CHOICES = [
  { id: 'RECEBIDA', name: 'Recebida' },
  { id: 'EM_PREENCHIMENTO', name: 'Em Preenchimento' },
  { id: 'CNPJ_CONSULTADO', name: 'CNPJ Consultado' },
  { id: 'SOCIOS_VALIDADOS', name: 'Sócios Validados' },
  { id: 'DOCUMENTOS_PENDENTES', name: 'Documentos Pendentes' },
  { id: 'DOCUMENTOS_ANALISADOS', name: 'Documentos Analisados' },
  { id: 'EM_ANALISE_KYC', name: 'Em Análise KYC' },
  { id: 'KYC_APROVADO', name: 'KYC Aprovado' },
  { id: 'AML_APROVADO', name: 'AML Aprovado' },
  { id: 'COMPLIANCE_APROVADO', name: 'Compliance Aprovado' },
  { id: 'EM_ASSINATURA', name: 'Em Assinatura' },
  { id: 'CONTRATO_ASSINADO', name: 'Contrato Assinado' },
  { id: 'APROVADA', name: 'Aprovada' },
  { id: 'REJEITADA', name: 'Rejeitada' },
];

const FilterBar = (props) => (
  <Filter {...props}>
    <SearchInput source="cnpj" alwaysOn />
    <SelectInput source="status" choices={STATUS_CHOICES} />
  </Filter>
);

export const SolicitacaoPJList = (props) => (
  <List {...props} filters={<FilterBar />} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid bulkActionButtons={<BulkApproveReject resourceName="solicitacoes_pj" />}>
      <TextField source="id" label="ID" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="razaoSocial" label="Razão Social" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
