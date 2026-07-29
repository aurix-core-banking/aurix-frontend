import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const PlanoShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="codigo" label="Codigo" />
      <TextField source="nome" label="Nome" />
      <NumberField source="limiteTransacoes" label="Limite transacoes" />
      <NumberField source="limiteContas" label="Limite contas" />
    </SimpleShowLayout>
  </Show>
);
