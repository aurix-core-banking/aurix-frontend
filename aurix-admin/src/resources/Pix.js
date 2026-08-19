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

const PixFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'CONFIRMADO', name: 'Confirmado' },
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'DEVOLVIDO', name: 'Devolvido' },
        { id: 'FALHOU', name: 'Falhou' },
      ]}
    />
    <SelectInput
      source="tipoChave"
      choices={[
        { id: 'CPF', name: 'CPF' },
        { id: 'CNPJ', name: 'CNPJ' },
        { id: 'EMAIL', name: 'E-mail' },
        { id: 'TELEFONE', name: 'Telefone' },
        { id: 'ALEATORIA', name: 'Aleatória' },
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

export const PixList = (props) => (
  <List
    {...props}
    filters={<PixFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataTransacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="e2e" label="E2E" />
      <FunctionField label="Remetente" render={(r) => r?.remetente?.nome || r?.contaOrigem?.numero || '-'} />
      <FunctionField label="Destinatário" render={(r) => r?.destinatario?.nome || r?.chaveDestino || '-'} />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="status" label="Status" />
      <DateField source="dataTransacao" label="Data" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);

export const PixShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Detalhes do PIX">
        <SimpleShowLayout>
          <TextField source="e2e" label="Identificação E2E" />
          <TextField source="tipoChave" label="Tipo de Chave" />
          <TextField source="chaveDestino" label="Chave Destino" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="descricao" label="Descrição" />
          <TextField source="status" label="Status" />
          <DateField source="dataTransacao" label="Data" showTime />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Remetente">
        <SimpleShowLayout>
          <FunctionField label="Conta" render={(r) => r?.contaOrigem?.numero || '-'} />
          <FunctionField label="Agência" render={(r) => r?.contaOrigem?.agencia || '-'} />
          <FunctionField label="Titular" render={(r) => r?.remetente?.nome || '-'} />
          <FunctionField label="CPF/CNPJ" render={(r) => r?.remetente?.documento || '-'} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Destinatário">
        <SimpleShowLayout>
          <FunctionField label="Conta Destino" render={(r) => r?.contaDestino?.numero || '-'} />
          <FunctionField label="Titular" render={(r) => r?.destinatario?.nome || '-'} />
          <FunctionField label="CPF/CNPJ" render={(r) => r?.destinatario?.documento || '-'} />
          <FunctionField label="ISPB" render={(r) => r?.ispbDestino || '-'} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Payload Completo">
        <SimpleShowLayout>
          <FunctionField
            label="Payload"
            render={(record) => (
              <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(record?.payload || record, null, 2)}
              </pre>
            )}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
