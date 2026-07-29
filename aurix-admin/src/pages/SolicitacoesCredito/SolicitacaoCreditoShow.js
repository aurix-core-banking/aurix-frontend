import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField, DateField } from 'react-admin';

export const SolicitacaoCreditoShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="clienteId" label="Cliente ID" />
      <NumberField source="valorSolicitado" label="Valor solicitado" />
      <NumberField source="valorAprovado" label="Valor aprovado" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
    </SimpleShowLayout>
  </Show>
);
