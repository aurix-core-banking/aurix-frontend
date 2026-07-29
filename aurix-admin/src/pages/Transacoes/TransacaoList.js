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
  DateInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FunctionField,
} from 'react-admin';

const TransacaoFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoTransacao"
      choices={[
        { id: 'DEPOSITO', name: 'Depósito' },
        { id: 'SAQUE', name: 'Saque' },
        { id: 'TRANSFERENCIA', name: 'Transferência' },
        { id: 'PAGAMENTO', name: 'Pagamento' },
        { id: 'PIX', name: 'PIX' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'PROCESSADA', name: 'Processada' },
        { id: 'CANCELADA', name: 'Cancelada' },
        { id: 'FALHADA', name: 'Falhada' },
      ]}
    />
    <DateInput source="dataInicio" label="Data Início" />
    <DateInput source="dataFim" label="Data Fim" />
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
  const tipo = record?.tipoTransacao;
  const prefix = tipo === 'SAQUE' || tipo === 'TRANSFERENCIA' ? '-' : '+';
  return `${prefix}R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const TransacaoList = (props) => (
  <List
    {...props}
    filters={<TransacaoFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataTransacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tipoTransacao" label="Tipo" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="contaOrigem.numero" label="Conta Origem" />
      <TextField source="contaDestino.numero" label="Conta Destino" />
      <TextField source="status" label="Status" />
      <DateField source="dataTransacao" label="Data" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
