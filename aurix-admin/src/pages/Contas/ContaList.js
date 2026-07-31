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

const ContaFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoConta"
      choices={[
        { id: 'CORRENTE', name: 'Corrente' },
        { id: 'POUPANCA', name: 'Poupança' },
        { id: 'SALARIO', name: 'Salário' },
        { id: 'EMPRESARIAL', name: 'Empresarial' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ATIVA', name: 'Ativa' },
        { id: 'INATIVA', name: 'Inativa' },
        { id: 'BLOQUEADA', name: 'Bloqueada' },
        { id: 'SUSPENSA', name: 'Suspensa' },
        { id: 'FECHADA', name: 'Fechada' },
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

const SaldoField = ({ record }) => {
  const saldo = record?.saldo || 0;
  return `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const ContaList = (props) => (
  <List
    {...props}
    filters={<ContaFilter />}
    actions={<ListActions />}
    sort={{ field: 'numero', order: 'ASC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="numero" label="Número da Conta" />
      <TextField source="agencia" label="Agência" />
      <TextField source="tipoConta" label="Tipo" />
      <FunctionField label="Saldo" render={SaldoField} />
      <TextField source="status" label="Status" />
      <TextField source="cliente.nome" label="Cliente" />
      <DateField source="dataAbertura" label="Data Abertura" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
