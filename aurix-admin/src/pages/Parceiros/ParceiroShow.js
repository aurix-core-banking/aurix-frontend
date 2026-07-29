import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const ParceiroShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="nome" label="Nome" />
      <TextField source="documento" label="Documento" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
    </SimpleShowLayout>
  </Show>
);
