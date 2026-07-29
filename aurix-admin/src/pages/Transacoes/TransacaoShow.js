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
  const tipo = record?.tipoTransacao;
  const prefix = tipo === 'SAQUE' || tipo === 'TRANSFERENCIA' ? '-' : '+';
  return `${prefix}R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const TransacaoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações da Transação">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="tipoTransacao" label="Tipo de Transação" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="descricao" label="Descrição" />
          <TextField source="status" label="Status" />
          <DateField source="dataTransacao" label="Data da Transação" showTime />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Contas Envolvidas">
        <SimpleShowLayout>
          <ReferenceField source="contaOrigemId" reference="contas" label="Conta Origem">
            <TextField source="numero" />
          </ReferenceField>
          <ReferenceField source="contaOrigemId" reference="contas" label="Cliente Origem">
            <ReferenceField source="clienteId" reference="clientes">
              <TextField source="nome" />
            </ReferenceField>
          </ReferenceField>
          <ReferenceField source="contaDestinoId" reference="contas" label="Conta Destino">
            <TextField source="numero" />
          </ReferenceField>
          <ReferenceField source="contaDestinoId" reference="contas" label="Cliente Destino">
            <ReferenceField source="clienteId" reference="clientes">
              <TextField source="nome" />
            </ReferenceField>
          </ReferenceField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
