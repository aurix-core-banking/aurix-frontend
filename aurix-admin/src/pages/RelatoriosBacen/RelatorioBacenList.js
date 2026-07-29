import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  Filter,
  SelectInput,
  TopToolbar,
  ExportButton,
} from 'react-admin';

const FilterBar = (props) => (
  <Filter {...props}>
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'ENVIADO', name: 'Enviado' },
        { id: 'ERRO', name: 'Erro' },
      ]}
    />
  </Filter>
);

export const RelatorioBacenList = (props) => (
  <List {...props} filters={<FilterBar />} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="codigoRelatorio" label="Código" />
      <TextField source="nomeRelatorio" label="Nome" />
      <TextField source="status" label="Status" />
      <DateField source="dataReferencia" label="Ref." />
      <ShowButton />
    </Datagrid>
  </List>
);
