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
        { id: 'BACEN', name: 'BACEN' },
        { id: 'CVM', name: 'CVM' },
        { id: 'CADE', name: 'CADE' },
        { id: 'ANATEL', name: 'ANATEL' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'EM_ANALISE', name: 'Em Análise' },
        { id: 'APROVADO', name: 'Aprovado' },
        { id: 'REJEITADO', name: 'Rejeitado' },
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
