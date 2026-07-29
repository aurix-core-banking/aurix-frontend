import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  FunctionField,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

const EnderecoField = ({ record }) => {
  if (!record?.endereco) return null;
  const { logradouro, numero, complemento, bairro, cidade, estado, cep } = record.endereco;
  return `${logradouro}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro}, ${cidade}/${estado} - CEP: ${cep}`;
};

export const ClienteShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações Pessoais">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="nome" label="Nome Completo" />
          <TextField source="documento" label="CPF/CNPJ" />
          <EmailField source="email" label="E-mail" />
          <TextField source="telefone" label="Telefone" />
          <TextField source="tipoPessoa" label="Tipo de Pessoa" />
          <TextField source="status" label="Status" />
          <DateField source="dataCadastro" label="Data de Cadastro" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Endereço">
        <SimpleShowLayout>
          <FunctionField
            label="Endereço Completo"
            render={EnderecoField}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
