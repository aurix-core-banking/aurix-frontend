import React from 'react';
import { Show, SimpleShowLayout, TextField, DateField, EditButton } from 'react-admin';

export const InstituicaoShow = (props) => (
  <Show {...props} actions={<EditButton />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="tenantId" label="Tenant" />
      <TextField source="nome" label="Nome" />
      <TextField source="cnpj" label="CNPJ" />
      <TextField source="emailContato" label="E-mail" />
      <TextField source="telefoneContato" label="Telefone" />
      <TextField source="plano" label="Plano" />
      <TextField source="status" label="Status" />
      <TextField source="deploymentProfile" label="Deploy" />
      <DateField source="dataCriacao" label="Criado" showTime />
    </SimpleShowLayout>
  </Show>
);
