import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const RelatorioBacenShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="codigoRelatorio" label="Código" />
      <TextField source="nomeRelatorio" label="Nome" />
      <TextField source="status" label="Status" />
      <DateField source="dataReferencia" label="Data referência" />
      <DateField source="dataCriacao" label="Criado" showTime />
    </SimpleShowLayout>
  </Show>
);
