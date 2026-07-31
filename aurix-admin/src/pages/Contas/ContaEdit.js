import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
} from 'react-admin';

export const ContaEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="numero" label="Número da Conta" validate={[required()]} />
      <TextInput source="agencia" label="Agência" validate={[required()]} />
      <SelectInput
        source="tipoConta"
        label="Tipo de Conta"
        choices={[
          { id: 'CORRENTE', name: 'Corrente' },
          { id: 'POUPANCA', name: 'Poupança' },
          { id: 'SALARIO', name: 'Salário' },
          { id: 'EMPRESARIAL', name: 'Empresarial' },
        ]}
        validate={[required()]}
      />
      <NumberInput
        source="saldo"
        label="Saldo"
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
          { id: 'SUSPENSA', name: 'Suspensa' },
          { id: 'FECHADA', name: 'Fechada' },
        ]}
        validate={[required()]}
      />
    </SimpleForm>
  </Edit>
);
