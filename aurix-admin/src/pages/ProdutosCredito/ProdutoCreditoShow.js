import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

export const ProdutoCreditoShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="codigo" label="Código" />
      <TextField source="nome" label="Nome" />
      <TextField source="tipo" label="Tipo" />
      <NumberField source="taxaJuros" label="Taxa juros" />
      <NumberField source="prazoMaximoMeses" label="Prazo máx. (meses)" />
    </SimpleShowLayout>
  </Show>
);
