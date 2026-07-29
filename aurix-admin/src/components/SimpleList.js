import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  ExportButton,
} from 'react-admin';

const defaultFields = [
  { source: 'id', type: 'text', label: 'ID' },
  { source: 'nome', type: 'text', label: 'Nome' },
  { source: 'status', type: 'text', label: 'Status' },
  { source: 'dataCriacao', type: 'date', label: 'Criado' },
];

const renderField = (f) => {
  if (f.type === 'number') return <NumberField key={f.source} source={f.source} label={f.label} />;
  if (f.type === 'date') return <DateField key={f.source} source={f.source} label={f.label} showTime />;
  if (f.type === 'boolean') return <BooleanField key={f.source} source={f.source} label={f.label} />;
  return <TextField key={f.source} source={f.source} label={f.label} />;
};

export const SimpleList = ({
  resource,
  fields = defaultFields,
  hasCreate = true,
  hasEdit = true,
  hasDelete = true,
  hasShow = true,
  sortField = 'id',
  sortOrder = 'DESC',
  ...rest
}) => (
  <List {...rest} sort={{ field: sortField, order: sortOrder }}>
    <TopToolbar>
      {hasCreate && <CreateButton />}
      <ExportButton />
    </TopToolbar>
    <Datagrid>
      {fields.map(renderField)}
      {hasShow && <ShowButton />}
      {hasEdit && <EditButton />}
      {hasDelete && <DeleteButton />}
    </Datagrid>
  </List>
);
