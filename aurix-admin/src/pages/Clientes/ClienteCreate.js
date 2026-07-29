import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  email,
  minLength,
  maxLength,
} from 'react-admin';

export const ClienteCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="nome" label="Nome Completo" validate={[required(), minLength(3)]} />
      <TextInput source="documento" label="CPF/CNPJ" validate={[required()]} />
      <TextInput source="email" label="E-mail" validate={[required(), email()]} />
      <TextInput source="telefone" label="Telefone" />
      <SelectInput
        source="tipoPessoa"
        label="Tipo de Pessoa"
        choices={[
          { id: 'FISICA', name: 'Física' },
          { id: 'JURIDICA', name: 'Jurídica' },
        ]}
        validate={[required()]}
      />
      <TextInput source="endereco.cep" label="CEP" />
      <TextInput source="endereco.logradouro" label="Logradouro" />
      <TextInput source="endereco.numero" label="Número" />
      <TextInput source="endereco.complemento" label="Complemento" />
      <TextInput source="endereco.bairro" label="Bairro" />
      <TextInput source="endereco.cidade" label="Cidade" />
      <TextInput source="endereco.estado" label="Estado" />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'ATIVO', name: 'Ativo' },
          { id: 'INATIVO', name: 'Inativo' },
          { id: 'BLOQUEADO', name: 'Bloqueado' },
        ]}
        defaultValue="ATIVO"
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);
