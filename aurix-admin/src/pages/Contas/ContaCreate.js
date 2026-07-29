import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
} from 'react-admin';

export const ContaCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="numero" label="Número da Conta" validate={[required()]} />
      <TextInput source="agencia" label="Agência" validate={[required()]} />
      <SelectInput
        source="tipoConta"
        label="Tipo de Conta"
        choices={[
          { id: 'CORRENTE', name: 'Corrente' },
          { id: 'POUPANCA', name: 'Poupança' },
          { id: 'INVESTIMENTO', name: 'Investimento' },
        ]}
        validate={[required()]}
      />
      <NumberInput
        source="saldo"
        label="Saldo Inicial"
        validate={[required(), minValue(0)]}
        step={0.01}
      />
      <ReferenceInput source="clienteId" reference="clientes">
        <AutocompleteInput
          optionText="nome"
          label="Cliente"
          validate={[required()]}
        />
      </ReferenceInput>
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'ATIVA', name: 'Ativa' },
          { id: 'INATIVA', name: 'Inativa' },
          { id: 'BLOQUEADA', name: 'Bloqueada' },
        ]}
        defaultValue="ATIVA"
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);
