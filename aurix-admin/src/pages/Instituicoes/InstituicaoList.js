import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const InstituicaoList = (props) => (
  <List {...props} actions={<ListActions />} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tenantId" label="Tenant" />
      <TextField source="nome" label="Nome" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="plano" label="Plano" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
