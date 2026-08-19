import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
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

const BoletoFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDENTE', name: 'Pendente' },
        { id: 'PAGO', name: 'Pago' },
        { id: 'VENCIDO', name: 'Vencido' },
        { id: 'CANCELADO', name: 'Cancelado' },
        { id: 'PROTESTADO', name: 'Protestado' },
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

const formatarCodigoBarras = (codigo) => {
  if (!codigo || codigo.length !== 44) return codigo || '-';
  return codigo.replace(/(\d{4})(?=\d)/g, '$1.');
};

export const BoletoList = (props) => (
  <List
    {...props}
    filters={<BoletoFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataVencimento', order: 'DESC' }}
  >
    <Datagrid>
      <FunctionField label="Código de Barras" render={(r) => formatarCodigoBarras(r?.codigoBarras)} />
      <FunctionField label="Beneficiário" render={(r) => r?.beneficiario?.nome || '-'} />
      <DateField source="dataVencimento" label="Vencimento" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="status" label="Status" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const BoletoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Dados do Boleto">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <FunctionField label="Código de Barras" render={(r) => r?.codigoBarras || '-'} />
          <FunctionField label="Linha Digitável" render={(r) => r?.linhaDigitavel || '-'} />
          <FunctionField label="Beneficiário" render={(r) => r?.beneficiario?.nome || '-'} />
          <FunctionField label="CNPJ Beneficiário" render={(r) => r?.beneficiario?.documento || '-'} />
          <DateField source="dataVencimento" label="Vencimento" />
          <DateField source="dataEmissao" label="Data Emissão" />
          <FunctionField label="Valor" render={ValorField} />
          <TextField source="status" label="Status" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Pagador">
        <SimpleShowLayout>
          <FunctionField label="Nome" render={(r) => r?.pagador?.nome || '-'} />
          <FunctionField label="CPF/CNPJ" render={(r) => r?.pagador?.documento || '-'} />
          <FunctionField label="Endereço" render={(r) => {
            if (!r?.pagador?.endereco) return '-';
            const e = r.pagador.endereco;
            return `${e.logradouro || ''}, ${e.numero || ''} - ${e.cidade || ''}/${e.estado || ''}`;
          }} />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Pagamentos">
        <SimpleShowLayout>
          <FunctionField
            label="Histórico de Pagamentos"
            render={(record) => {
              if (!record?.pagamentos?.length) return 'Nenhum pagamento registrado';
              return record.pagamentos.map((p) => (
                <div key={p.id}>
                  {p.dataPagamento} - R$ {p.valor?.toLocaleString('pt-BR')} - {p.formaPagamento} - {p.status}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Protestos">
        <SimpleShowLayout>
          <FunctionField
            label="Histórico de Protestos"
            render={(record) => {
              if (!record?.protestos?.length) return 'Nenhum protesto registrado';
              return record.protestos.map((p) => (
                <div key={p.id}>
                  {p.dataProtesto} - {p.motivo} - {p.cartorio} - {p.status}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
