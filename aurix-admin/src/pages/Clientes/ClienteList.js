import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
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
} from 'react-admin';

const ClienteFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoPessoa"
      choices={[
        { id: 'FISICA', name: 'Física' },
        { id: 'JURIDICA', name: 'Jurídica' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ATIVO', name: 'Ativo' },
        { id: 'INATIVO', name: 'Inativo' },
        { id: 'BLOQUEADO', name: 'Bloqueado' },
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

export const ClienteList = (props) => (
  <List
    {...props}
    filters={<ClienteFilter />}
    actions={<ListActions />}
    sort={{ field: 'nome', order: 'ASC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="nome" label="Nome" />
      <TextField source="documento" label="CPF/CNPJ" />
      <EmailField source="email" label="E-mail" />
      <TextField source="telefone" label="Telefone" />
      <TextField source="tipoPessoa" label="Tipo" />
      <TextField source="status" label="Status" />
      <DateField source="dataCadastro" label="Data Cadastro" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
