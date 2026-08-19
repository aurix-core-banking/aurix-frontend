import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
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
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
  Show,
  SimpleShowLayout,
  ReferenceField,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

const ContaFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoConta"
      choices={[
        { id: 'CORRENTE', name: 'Corrente' },
        { id: 'POUPANCA', name: 'Poupança' },
        { id: 'SALARIO', name: 'Salário' },
        { id: 'EMPRESARIAL', name: 'Empresarial' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ATIVA', name: 'Ativa' },
        { id: 'INATIVA', name: 'Inativa' },
        { id: 'BLOQUEADA', name: 'Bloqueada' },
        { id: 'SUSPENSA', name: 'Suspensa' },
        { id: 'FECHADA', name: 'Fechada' },
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

const SaldoField = ({ record }) => {
  const saldo = record?.saldo || 0;
  return `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const ContaList = (props) => (
  <List
    {...props}
    filters={<ContaFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataCriacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <FunctionField label="Cliente" render={(r) => r?.cliente?.nome || '-'} />
      <TextField source="numero" label="Número" />
      <FunctionField label="Saldo" render={SaldoField} />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Data Criação" showTime />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ContaEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput source="clienteId" reference="clientes">
        <AutocompleteInput optionText="nome" label="Titular" validate={[required()]} />
      </ReferenceInput>
      <NumberInput
        source="limite"
        label="Limite"
        validate={[minValue(0)]}
        step={0.01}
      />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'ATIVA', name: 'Ativa' },
          { id: 'INATIVA', name: 'Inativa' },
          { id: 'BLOQUEADA', name: 'Bloqueada' },
          { id: 'SUSPENSA', name: 'Suspensa' },
          { id: 'FECHADA', name: 'Fechada' },
        ]}
        validate={[required()]}
      />
    </SimpleForm>
  </Edit>
);

export const ContaShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações da Conta">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="numero" label="Número" />
          <TextField source="agencia" label="Agência" />
          <TextField source="tipoConta" label="Tipo" />
          <FunctionField label="Saldo" render={SaldoField} />
          <TextField source="status" label="Status" />
          <DateField source="dataCriacao" label="Data Criação" showTime />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Titular">
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
      <Tab label="Extrato e Transações">
        <SimpleShowLayout>
          <FunctionField
            label="Extrato"
            render={(record) => {
              if (!record?.transacoes?.length) return 'Nenhuma transação encontrada';
              return record.transacoes.map((t) => (
                <div key={t.id}>
                  {t.dataTransacao} - {t.tipoTransacao} - R$ {t.valor?.toLocaleString('pt-BR')}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const ContaCreate = ContaList; // Create não aplicável neste contexto
