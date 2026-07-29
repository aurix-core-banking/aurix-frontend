import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  TopToolbar,
  ExportButton,
} from 'react-admin';

export const EmpresaList = (props) => (
  <List {...props} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="codigoEmpresa" label="Codigo" />
      <TextField source="nomeEmpresa" label="Nome" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
