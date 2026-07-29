import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
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
        { id: 'APROVADA', name: 'Aprovada' },
        { id: 'REJEITADA', name: 'Rejeitada' },
      ]}
    />
  </Filter>
);

export const SolicitacaoCreditoList = (props) => (
  <List {...props} filters={<FilterBar />} sort={{ field: 'id', order: 'DESC' }}>
    <TopToolbar>
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="clienteId" label="Cliente" />
      <NumberField source="valorSolicitado" label="Valor" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Criado" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
