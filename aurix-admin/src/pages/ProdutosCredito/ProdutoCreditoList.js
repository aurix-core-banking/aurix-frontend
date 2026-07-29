import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ShowButton,
  TopToolbar,
  ExportButton,
} from 'react-admin';

export const ProdutoCreditoList = (props) => (
  <List {...props} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="codigo" label="Código" />
      <TextField source="nome" label="Nome" />
      <TextField source="tipo" label="Tipo" />
      <NumberField source="taxaJuros" label="Taxa" />
      <ShowButton />
    </Datagrid>
  </List>
);
