import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
} from 'react-admin';

export const PIXCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="chave" label="Chave PIX" validate={[required()]} />
      <SelectInput
        source="tipoChave"
        label="Tipo de Chave"
        choices={[
          { id: 'CPF', name: 'CPF' },
          { id: 'CNPJ', name: 'CNPJ' },
          { id: 'EMAIL', name: 'E-mail' },
          { id: 'TELEFONE', name: 'Telefone' },
          { id: 'ALEATORIA', name: 'Aleatória' },
        ]}
        validate={[required()]}
      />
      <NumberInput
        source="valor"
        label="Valor Limite"
        validate={[required(), minValue(0.01)]}
        step={0.01}
      />
      <ReferenceInput source="contaId" reference="contas">
        <AutocompleteInput
          optionText={(record) => `${record.numero} - ${record.cliente?.nome || ''}`}
          label="Conta"
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
