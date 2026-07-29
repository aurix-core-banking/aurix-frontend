import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';

export const InstituicaoEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="tenantId" label="Tenant ID" />
      <TextInput source="nome" label="Nome" />
      <TextInput source="cnpj" label="CNPJ" />
      <TextInput source="emailContato" label="E-mail" />
      <TextInput source="telefoneContato" label="Telefone" />
      <SelectInput
        source="plano"
        label="Plano"
        choices={[
          { id: 'STARTER', name: 'Starter' },
          { id: 'GROWTH', name: 'Growth' },
          { id: 'ENTERPRISE', name: 'Enterprise' },
        ]}
      />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'PENDENTE', name: 'Pendente' },
          { id: 'ATIVO', name: 'Ativo' },
          { id: 'SUSPENSO', name: 'Suspenso' },
        ]}
      />
    </SimpleForm>
  </Edit>
);
