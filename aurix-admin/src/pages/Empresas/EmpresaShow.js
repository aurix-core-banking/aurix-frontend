import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const EmpresaShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="codigoEmpresa" label="Codigo" />
      <TextField source="nomeEmpresa" label="Nome" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="descricao" label="Descricao" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <DateField source="dataAtualizacao" label="Atualizado" showTime />
    </SimpleShowLayout>
  </Show>
);
