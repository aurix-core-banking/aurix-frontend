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
  FunctionField,
  Edit,
  SimpleForm,
  TextInput,
  required,
  email,
  minLength,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
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

const EnderecoField = ({ record }) => {
  if (!record?.endereco) return '-';
  const { logradouro, numero, complemento, bairro, cidade, estado, cep } = record.endereco;
  return `${logradouro}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro}, ${cidade}/${estado} - CEP: ${cep}`;
};

export const ClienteList = (props) => (
  <List
    {...props}
    filters={<ClienteFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataCadastro', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="documento" label="CPF/CNPJ" />
      <TextField source="nome" label="Nome" />
      <EmailField source="email" label="E-mail" />
      <TextField source="status" label="Status" />
      <DateField source="dataCadastro" label="Data Cadastro" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ClienteEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="nome" label="Nome Completo" validate={[required(), minLength(3)]} />
      <TextInput source="documento" label="CPF/CNPJ" validate={[required()]} />
      <TextInput source="email" label="E-mail" validate={[required(), email()]} />
      <TextInput source="telefone" label="Telefone" />
      <TextInput source="endereco.cep" label="CEP" />
      <TextInput source="endereco.logradouro" label="Logradouro" />
      <TextInput source="endereco.numero" label="Número" />
      <TextInput source="endereco.complemento" label="Complemento" />
      <TextInput source="endereco.bairro" label="Bairro" />
      <TextInput source="endereco.cidade" label="Cidade" />
      <TextInput source="endereco.estado" label="Estado" />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'ATIVO', name: 'Ativo' },
          { id: 'INATIVO', name: 'Inativo' },
          { id: 'BLOQUEADO', name: 'Bloqueado' },
        ]}
        validate={[required()]}
      />
    </SimpleForm>
  </Edit>
);

export const ClienteShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Dados Pessoais">
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
          <FunctionField label="Endereço Completo" render={EnderecoField} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Histórico">
        <SimpleShowLayout>
          <FunctionField
            label="Histórico de Contas"
            render={(record) => {
              if (!record?.contas?.length) return 'Nenhuma conta encontrada';
              return record.contas.map((c) => (
                <div key={c.id}>
                  Conta {c.numero} ({c.tipoConta}) - {c.status}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
      <Tab label="KYC">
        <SimpleShowLayout>
          <FunctionField
            label="Status KYC"
            render={(record) => record?.kycStatus || 'Não iniciado'}
          />
          <FunctionField
            label="Documentos Verificados"
            render={(record) => {
              if (!record?.documentos?.length) return 'Nenhum documento';
              return record.documentos.map((d) => (
                <div key={d.id}>
                  {d.tipo} - {d.status} ({d.dataVerificacao || 'Pendente'})
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const ClienteCreate = ClienteList;
