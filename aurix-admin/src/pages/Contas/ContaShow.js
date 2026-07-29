import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  TabbedShowLayout,
  Tab,
  FunctionField,
} from 'react-admin';

const SaldoField = ({ record }) => {
  const saldo = record?.saldo || 0;
  return `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const ContaShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações da Conta">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="numero" label="Número da Conta" />
          <TextField source="agencia" label="Agência" />
          <TextField source="tipoConta" label="Tipo de Conta" />
          <FunctionField label="Saldo" render={SaldoField} />
          <TextField source="status" label="Status" />
          <DateField source="dataAbertura" label="Data de Abertura" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Cliente">
        <SimpleShowLayout>
          <ReferenceField source="clienteId" reference="clientes" label="Cliente">
            <TextField source="nome" />
          </ReferenceField>
          <ReferenceField source="clienteId" reference="clientes" label="Documento">
            <TextField source="documento" />
          </ReferenceField>
          <ReferenceField source="clienteId" reference="clientes" label="E-mail">
            <TextField source="email" />
          </ReferenceField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
