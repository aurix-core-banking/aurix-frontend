import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  Filter,
  SearchInput,
  SelectInput,
  TopToolbar,
  ExportButton,
  FunctionField,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

const TedFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'CONFIRMADA', name: 'Confirmada' },
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'CANCELADA', name: 'Cancelada' },
        { id: 'FALHADA', name: 'Falhada' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const TedList = (props) => (
  <List
    {...props}
    filters={<TedFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataTransferencia', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="ispbDestino" label="ISPB Destino" />
      <TextField source="agenciaDestino" label="Agência Destino" />
      <TextField source="contaDestino" label="Conta Destino" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="status" label="Status" />
      <DateField source="dataTransferencia" label="Data" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);

export const TedShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Detalhes da Transferência">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="descricao" label="Descrição" />
          <TextField source="finalidade" label="Finalidade" />
          <TextField source="status" label="Status" />
          <DateField source="dataTransferencia" label="Data" showTime />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Conta Origem">
        <SimpleShowLayout>
          <FunctionField label="Conta" render={(r) => r?.contaOrigem?.numero || '-'} />
          <FunctionField label="Agência" render={(r) => r?.contaOrigem?.agencia || '-'} />
          <FunctionField label="ISPB" render={(r) => r?.contaOrigem?.ispb || '-'} />
          <FunctionField label="Titular" render={(r) => r?.remetente?.nome || '-'} />
          <FunctionField label="CPF/CNPJ" render={(r) => r?.remetente?.documento || '-'} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Conta Destino">
        <SimpleShowLayout>
          <TextField source="ispbDestino" label="ISPB Destino" />
          <TextField source="agenciaDestino" label="Agência Destino" />
          <TextField source="contaDestino" label="Conta Destino" />
          <FunctionField label="Titular Destino" render={(r) => r?.destinatario?.nome || '-'} />
          <FunctionField label="CPF/CNPJ Destino" render={(r) => r?.destinatario?.documento || '-'} />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
