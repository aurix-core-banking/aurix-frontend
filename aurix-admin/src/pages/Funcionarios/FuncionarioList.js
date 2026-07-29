import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ShowButton,
  TopToolbar,
  ExportButton,
} from 'react-admin';

export const FuncionarioList = (props) => (
  <List {...props} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="matricula" label="Matricula" />
      <TextField source="nomeCompleto" label="Nome" />
      <TextField source="email" label="Email" />
      <NumberField source="empresaId" label="Empresa ID" />
      <TextField source="status" label="Status" />
      <DateField source="dataAdmissao" label="Admissao" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
