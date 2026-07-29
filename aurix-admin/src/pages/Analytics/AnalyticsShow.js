import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  TabbedShowLayout,
  Tab,
  FunctionField,
} from 'react-admin';

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

const DadosField = ({ record }) => {
  if (!record?.dados) return null;
  return JSON.stringify(record.dados, null, 2);
};

export const AnalyticsShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações da Métrica">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="tipoMetrica" label="Tipo de Métrica" />
          <TextField source="nome" label="Nome" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="periodo" label="Período" />
          <DateField source="dataMetrica" label="Data da Métrica" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Dados Detalhados">
        <SimpleShowLayout>
          <FunctionField
            label="Dados (JSON)"
            render={DadosField}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
