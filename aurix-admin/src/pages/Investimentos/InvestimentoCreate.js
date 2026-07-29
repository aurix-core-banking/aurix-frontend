import React from 'react';
import {
  Create,
  SimpleForm,
  SelectInput,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  DateInput,
  required,
  minValue,
} from 'react-admin';

export const InvestimentoCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <SelectInput
        source="tipoInvestimento"
        label="Tipo de Investimento"
        choices={[
          { id: 'CDB', name: 'CDB' },
          { id: 'LCI', name: 'LCI' },
          { id: 'LCA', name: 'LCA' },
          { id: 'TESOURO', name: 'Tesouro Direto' },
          { id: 'FUNDO', name: 'Fundo de Investimento' },
        ]}
        validate={[required()]}
      />
      <NumberInput
        source="valor"
        label="Valor do Investimento"
        validate={[required(), minValue(0.01)]}
        step={0.01}
      />
      <NumberInput
        source="rentabilidadeAnual"
        label="Rentabilidade Anual (%)"
        validate={[required(), minValue(0)]}
        step={0.01}
      />
      <ReferenceInput source="contaId" reference="contas">
        <AutocompleteInput
          optionText={(record) => `${record.numero} - ${record.cliente?.nome || ''}`}
          label="Conta"
          validate={[required()]}
        />
      </ReferenceInput>
      <DateInput
        source="dataAplicacao"
        label="Data de Aplicação"
        validate={[required()]}
      />
      <DateInput
        source="dataVencimento"
        label="Data de Vencimento"
        validate={[required()]}
      />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'ATIVO', name: 'Ativo' },
          { id: 'RESGATADO', name: 'Resgatado' },
          { id: 'VENCIDO', name: 'Vencido' },
        ]}
        defaultValue="ATIVO"
        validate={[required()]}
      />
    </SimpleForm>
  </Create>
);
