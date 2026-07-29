import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  TabbedShowLayout,
  Tab,
  FunctionField,
} from 'react-admin';

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

const RentabilidadeField = ({ record }) => {
  const rentabilidade = record?.rentabilidadeAnual || 0;
  return `${rentabilidade.toFixed(2)}% a.a.`;
};

export const InvestimentoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações do Investimento">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="tipoInvestimento" label="Tipo de Investimento" />
          <FunctionField label="Valor" render={ValorField} />
          <FunctionField label="Rentabilidade Anual" render={RentabilidadeField} />
          <TextField source="status" label="Status" />
          <DateField source="dataAplicacao" label="Data de Aplicação" />
          <DateField source="dataVencimento" label="Data de Vencimento" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Conta e Cliente">
        <SimpleShowLayout>
          <ReferenceField source="contaId" reference="contas" label="Conta">
            <TextField source="numero" />
          </ReferenceField>
          <ReferenceField source="contaId" reference="contas" label="Agência">
            <TextField source="agencia" />
          </ReferenceField>
          <ReferenceField source="contaId" reference="contas" label="Cliente">
            <ReferenceField source="clienteId" reference="clientes">
              <TextField source="nome" />
            </ReferenceField>
          </ReferenceField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
