import React from 'react';
import { List, Datagrid, TextField, NumberField, ShowButton, TopToolbar, ExportButton } from 'react-admin';

export const PlanoList = (props) => (
  <List {...props} sort={{ field: 'codigo', order: 'ASC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="codigo" label="Codigo" />
      <TextField source="nome" label="Nome" />
      <NumberField source="limiteTransacoes" label="Limite trans." />
      <NumberField source="limiteContas" label="Limite contas" />
      <ShowButton />
    </Datagrid>
  </List>
);
