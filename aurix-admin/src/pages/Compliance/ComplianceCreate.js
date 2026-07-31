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
          { id: 'LEI', name: 'Lei' },
          { id: 'DECRETO', name: 'Decreto' },
          { id: 'RESOLUCAO', name: 'Resolução' },
          { id: 'CIRCULAR', name: 'Circular' },
          { id: 'INSTRUCAO', name: 'Instrução' },
          { id: 'PORTARIA', name: 'Portaria' },
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
          { id: 'EM_ANALISE', name: 'Em Análise' },
          { id: 'CONFORME', name: 'Conforme' },
          { id: 'NAO_CONFORME', name: 'Não Conforme' },
          { id: 'NAO_CONFORME_CRITICO', name: 'Não Conforme Crítico' },
          { id: 'PENDENTE_CORRECAO', name: 'Pendente Correção' },
          { id: 'CORRIGIDO', name: 'Corrigido' },
        ]}
        defaultValue="EM_ANALISE"
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);
