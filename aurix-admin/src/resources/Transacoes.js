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
  DateInput,
  TopToolbar,
  ExportButton,
  FunctionField,
  Show,
  SimpleShowLayout,
  ReferenceField,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

const TransacaoFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoTransacao"
      choices={[
        { id: 'PIX', name: 'PIX' },
        { id: 'TED', name: 'TED' },
        { id: 'DOC', name: 'DOC' },
        { id: 'SAQUE', name: 'Saque' },
        { id: 'DEPOSITO', name: 'Depósito' },
        { id: 'TRANSFERENCIA_INTERNA', name: 'Transferência Interna' },
        { id: 'PAGAMENTO_BOLETO', name: 'Pagamento de Boleto' },
        { id: 'PAGAMENTO_CARTAO', name: 'Pagamento de Cartão' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'PROCESSADA', name: 'Processada' },
        { id: 'CANCELADA', name: 'Cancelada' },
        { id: 'FALHADA', name: 'Falhada' },
        { id: 'REVERTIDA', name: 'Revertida' },
      ]}
    />
    <DateInput source="dataInicio" label="Data Início" />
    <DateInput source="dataFim" label="Data Fim" />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

const ValorField = ({ record }) => {
  const valor = record?.valor || 0;
  const tipo = record?.tipoTransacao;
  const prefix = tipo === 'SAQUE' || tipo === 'TRANSFERENCIA_INTERNA' ? '-' : '+';
  return `${prefix}R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const TransacaoList = (props) => (
  <List
    {...props}
    filters={<TransacaoFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataTransacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tipoTransacao" label="Tipo" />
      <FunctionField label="Valor" render={ValorField} />
      <DateField source="dataTransacao" label="Data" showTime />
      <TextField source="status" label="Status" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const TransacaoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Detalhes da Transação">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="tipoTransacao" label="Tipo" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="descricao" label="Descrição" />
          <TextField source="status" label="Status" />
          <DateField source="dataTransacao" label="Data" showTime />
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
      <Tab label="Chargebacks">
        <SimpleShowLayout>
          <FunctionField
            label="Chargebacks"
            render={(record) => {
              if (!record?.chargebacks?.length) return 'Nenhum chargeback registrado';
              return record.chargebacks.map((cb) => (
                <div key={cb.id}>
                  {cb.data} - {cb.motivo} - {cb.status} - R$ {cb.valor?.toLocaleString('pt-BR')}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
