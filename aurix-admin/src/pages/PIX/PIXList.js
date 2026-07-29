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

const PIXFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoChave"
      choices={[
        { id: 'CPF', name: 'CPF' },
        { id: 'CNPJ', name: 'CNPJ' },
        { id: 'EMAIL', name: 'E-mail' },
        { id: 'TELEFONE', name: 'Telefone' },
        { id: 'ALEATORIA', name: 'Aleatória' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ATIVA', name: 'Ativa' },
        { id: 'INATIVA', name: 'Inativa' },
        { id: 'BLOQUEADA', name: 'Bloqueada' },
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

export const PIXList = (props) => (
  <List
    {...props}
    filters={<PIXFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataCriacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="chave" label="Chave PIX" />
      <TextField source="tipoChave" label="Tipo" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="conta.numero" label="Conta" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Data Criação" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
