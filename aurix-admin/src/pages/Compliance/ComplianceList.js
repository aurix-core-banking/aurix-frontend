import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  Filter,
  SearchInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';

const ComplianceFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoRegulacao"
      choices={[
        { id: 'LEI', name: 'Lei' },
        { id: 'DECRETO', name: 'Decreto' },
        { id: 'RESOLUCAO', name: 'Resolução' },
        { id: 'CIRCULAR', name: 'Circular' },
        { id: 'INSTRUCAO', name: 'Instrução' },
        { id: 'PORTARIA', name: 'Portaria' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'EM_ANALISE', name: 'Em Análise' },
        { id: 'CONFORME', name: 'Conforme' },
        { id: 'NAO_CONFORME', name: 'Não Conforme' },
        { id: 'NAO_CONFORME_CRITICO', name: 'Não Conforme Crítico' },
        { id: 'PENDENTE_CORRECAO', name: 'Pendente Correção' },
        { id: 'CORRIGIDO', name: 'Corrigido' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const ComplianceList = (props) => (
  <List
    {...props}
    filters={<ComplianceFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataCriacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="nome" label="Nome" />
      <TextField source="tipoRegulacao" label="Tipo" />
      <TextField source="descricao" label="Descrição" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Data Criação" />
      <DateField source="dataVencimento" label="Data Vencimento" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
