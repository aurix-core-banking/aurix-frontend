import React from 'react';
import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';

export const InstituicaoCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="tenantId" label="Tenant ID" required />
      <TextInput source="nome" label="Nome" required />
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
  </Create>
);
