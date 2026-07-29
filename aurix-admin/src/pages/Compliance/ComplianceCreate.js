import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  DateInput,
  required,
} from 'react-admin';

export const ComplianceCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="nome" label="Nome" validate={[required()]} />
      <SelectInput
        source="tipoRegulacao"
        label="Tipo de Regulação"
        choices={[
          { id: 'BACEN', name: 'BACEN' },
          { id: 'CVM', name: 'CVM' },
          { id: 'CADE', name: 'CADE' },
          { id: 'ANATEL', name: 'ANATEL' },
        ]}
        validate={[required()]}
      />
      <TextInput source="descricao" label="Descrição" multiline rows={4} />
      <TextInput source="documento" label="Documento" />
      <DateInput
        source="dataVencimento"
        label="Data de Vencimento"
        validate={[required()]}
      />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'PENDENTE', name: 'Pendente' },
          { id: 'EM_ANALISE', name: 'Em Análise' },
          { id: 'APROVADO', name: 'Aprovado' },
          { id: 'REJEITADO', name: 'Rejeitado' },
        ]}
        defaultValue="PENDENTE"
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);
