import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  EditButton,
  ArrayField,
  Datagrid,
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

export const SimpleShow = ({ resource, fields = defaultFields, hasEdit = true, ...rest }) => (
  <Show {...rest} actions={hasEdit ? <EditButton /> : null}>
    <SimpleShowLayout>{fields.map(renderField)}</SimpleShowLayout>
  </Show>
);
