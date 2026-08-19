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
  SelectArrayInput,
  required,
  email,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

const UsuarioFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="role"
      choices={[
        { id: 'ADMIN', name: 'Administrador' },
        { id: 'OPERADOR', name: 'Operador' },
        { id: 'ANALISTA', name: 'Analista' },
        { id: 'COMPLIANCE', name: 'Compliance' },
        { id: 'SUPORTE', name: 'Suporte' },
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

const formatarDataAcesso = (data) => {
  if (!data) return 'Nunca acessou';
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const UsuarioList = (props) => (
  <List
    {...props}
    filters={<UsuarioFilter />}
    actions={<ListActions />}
    sort={{ field: 'ultimoAcesso', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <EmailField source="email" label="E-mail" />
      <TextField source="nome" label="Nome" />
      <FunctionField label="Role" render={(r) => r?.role || '-'} />
      <FunctionField label="Último Acesso" render={(r) => formatarDataAcesso(r?.ultimoAcesso)} />
      <TextField source="status" label="Status" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UsuarioEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="nome" label="Nome" validate={[required()]} />
      <TextInput source="email" label="E-mail" validate={[required(), email()]} />
      <SelectInput
        source="role"
        label="Role"
        choices={[
          { id: 'ADMIN', name: 'Administrador' },
          { id: 'OPERADOR', name: 'Operador' },
          { id: 'ANALISTA', name: 'Analista' },
          { id: 'COMPLIANCE', name: 'Compliance' },
          { id: 'SUPORTE', name: 'Suporte' },
        ]}
        validate={[required()]}
      />
      <SelectArrayInput
        source="permissoes"
        label="Permissões"
        choices={[
          { id: 'contas:ler', name: 'Contas - Leitura' },
          { id: 'contas:escrever', name: 'Contas - Escrita' },
          { id: 'transacoes:ler', name: 'Transações - Leitura' },
          { id: 'transacoes:escrever', name: 'Transações - Escrita' },
          { id: 'clientes:ler', name: 'Clientes - Leitura' },
          { id: 'clientes:escrever', name: 'Clientes - Escrita' },
          { id: 'compliance:ler', name: 'Compliance - Leitura' },
          { id: 'compliance:escrever', name: 'Compliance - Escrita' },
          { id: 'creditos:ler', name: 'Créditos - Leitura' },
          { id: 'creditos:escrever', name: 'Créditos - Escrita' },
          { id: 'configuracoes:ler', name: 'Configurações - Leitura' },
          { id: 'configuracoes:escrever', name: 'Configurações - Escrita' },
          { id: 'relatorios:ler', name: 'Relatórios - Leitura' },
          { id: 'auditoria:ler', name: 'Auditoria - Leitura' },
        ]}
      />
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

export const UsuarioShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Dados do Usuário">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="nome" label="Nome" />
          <EmailField source="email" label="E-mail" />
          <TextField source="role" label="Role" />
          <TextField source="status" label="Status" />
          <DateField source="dataCriacao" label="Data de Criação" />
          <FunctionField label="Último Acesso" render={(r) => formatarDataAcesso(r?.ultimoAcesso)} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Permissões">
        <SimpleShowLayout>
          <FunctionField
            label="Permissões"
            render={(record) => {
              if (!record?.permissoes?.length) return 'Nenhuma permissão atribuída';
              return record.permissoes.map((p) => (
                <div key={p}>{p}</div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
