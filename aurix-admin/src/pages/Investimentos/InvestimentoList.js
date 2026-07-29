import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  Filter,
  SearchInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FunctionField,
} from 'react-admin';

const InvestimentoFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoInvestimento"
      choices={[
        { id: 'CDB', name: 'CDB' },
        { id: 'LCI', name: 'LCI' },
        { id: 'LCA', name: 'LCA' },
        { id: 'TESOURO', name: 'Tesouro Direto' },
        { id: 'FUNDO', name: 'Fundo de Investimento' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ATIVO', name: 'Ativo' },
        { id: 'RESGATADO', name: 'Resgatado' },
        { id: 'VENCIDO', name: 'Vencido' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

const RentabilidadeField = ({ record }) => {
  const rentabilidade = record?.rentabilidadeAnual || 0;
  return `${rentabilidade.toFixed(2)}% a.a.`;
};

export const InvestimentoList = (props) => (
  <List
    {...props}
    filters={<InvestimentoFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataAplicacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tipoInvestimento" label="Tipo" />
      <FunctionField label="Valor" render={ValorField} />
      <FunctionField label="Rentabilidade" render={RentabilidadeField} />
      <TextField source="conta.numero" label="Conta" />
      <TextField source="status" label="Status" />
      <DateField source="dataAplicacao" label="Data Aplicação" />
      <DateField source="dataVencimento" label="Data Vencimento" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
