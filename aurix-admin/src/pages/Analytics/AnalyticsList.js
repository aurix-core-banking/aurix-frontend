import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  Filter,
  SearchInput,
  SelectInput,
  TopToolbar,
  ExportButton,
  FunctionField,
} from 'react-admin';

const AnalyticsFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoMetrica"
      choices={[
        { id: 'TRANSACOES', name: 'Transações' },
        { id: 'CLIENTES', name: 'Clientes' },
        { id: 'INVESTIMENTOS', name: 'Investimentos' },
        { id: 'PIX', name: 'PIX' },
        { id: 'COMPLIANCE', name: 'Compliance' },
      ]}
    />
    <SelectInput
      source="periodo"
      choices={[
        { id: 'DIARIO', name: 'Diário' },
        { id: 'SEMANAL', name: 'Semanal' },
        { id: 'MENSAL', name: 'Mensal' },
        { id: 'ANUAL', name: 'Anual' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const AnalyticsList = (props) => (
  <List
    {...props}
    filters={<AnalyticsFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataMetrica', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tipoMetrica" label="Tipo" />
      <TextField source="nome" label="Nome" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="periodo" label="Período" />
      <DateField source="dataMetrica" label="Data" />
      <ShowButton />
    </Datagrid>
  </List>
);
