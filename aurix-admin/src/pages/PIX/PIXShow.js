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

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const PIXShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações PIX">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="chave" label="Chave PIX" />
          <TextField source="tipoChave" label="Tipo de Chave" />
          <FunctionField label="Valor Limite" render={ValorField} />
          <TextField source="status" label="Status" />
          <DateField source="dataCriacao" label="Data de Criação" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Conta e Cliente">
        <SimpleShowLayout>
          <ReferenceField source="contaId" reference="contas" label="Conta">
            <TextField source="numero" />
          </ReferenceField>
          <ReferenceField source="contaId" reference="contas" label="Agência">
            <TextField source="agencia" />
          </ReferenceField>
          <ReferenceField source="contaId" reference="contas" label="Cliente">
            <ReferenceField source="clienteId" reference="clientes">
              <TextField source="nome" />
            </ReferenceField>
          </ReferenceField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
