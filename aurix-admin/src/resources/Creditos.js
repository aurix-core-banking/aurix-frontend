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

const CreditoFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoCredito"
      choices={[
        { id: 'EMPRESTIMO', name: 'Empréstimo' },
        { id: 'FINANCIAMENTO', name: 'Financiamento' },
        { id: 'CONSIGNADO', name: 'Consignado' },
        { id: 'CARTAO_CREDITO', name: 'Cartão de Crédito' },
        { id: 'CHEQUE_ESPECIAL', name: 'Cheque Especial' },
        { id: 'MICROCREDITO', name: 'Microcrédito' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'SOLICITADO', name: 'Solicitado' },
        { id: 'EM_ANALISE', name: 'Em Análise' },
        { id: 'APROVADO', name: 'Aprovado' },
        { id: 'REPROVADO', name: 'Reprovado' },
        { id: 'LIBERADO', name: 'Liberado' },
        { id: 'EM_PAGAMENTO', name: 'Em Pagamento' },
        { id: 'QUITADO', name: 'Quitado' },
        { id: 'INADIMPLENTE', name: 'Inadimplente' },
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
  const valor = record?.valorTotal || record?.valor || 0;
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const CreditoList = (props) => (
  <List
    {...props}
    filters={<CreditoFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataSolicitacao', order: 'DESC' }}
  >
    <Datagrid>
      <FunctionField label="Cliente" render={(r) => r?.cliente?.nome || '-'} />
      <TextField source="tipoCredito" label="Tipo" />
      <FunctionField label="Valor" render={ValorField} />
      <TextField source="prazoMeses" label="Prazo (meses)" />
      <TextField source="status" label="Status" />
      <DateField source="dataSolicitacao" label="Data Solicitação" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CreditoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Dados do Crédito">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <FunctionField label="Cliente" render={(r) => r?.cliente?.nome || '-'} />
          <TextField source="tipoCredito" label="Tipo" />
          <FunctionField label="Valor Total" render={ValorField} />
          <FunctionField label="Valor Parcela" render={(r) => {
            const v = r?.valorParcela || 0;
            return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }} />
          <TextField source="prazoMeses" label="Prazo (meses)" />
          <FunctionField label="Taxa" render={(r) => r?.taxaJuros ? `${r.taxaJuros}% a.m.` : '-'} />
          <TextField source="status" label="Status" />
          <DateField source="dataSolicitacao" label="Data Solicitação" />
          <DateField source="dataAprovacao" label="Data Aprovação" />
          <DateField source="dataLiberacao" label="Data Liberação" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Parcelas">
        <SimpleShowLayout>
          <FunctionField
            label="Cronograma de Parcelas"
            render={(record) => {
              if (!record?.parcelas?.length) return 'Nenhuma parcela encontrada';
              return (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>Nº</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>Vencimento</th>
                      <th style={{ textAlign: 'right', padding: '4px 8px' }}>Valor</th>
                      <th style={{ textAlign: 'right', padding: '4px 8px' }}>Pago</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.parcelas.map((p) => (
                      <tr key={p.numero}>
                        <td style={{ padding: '4px 8px' }}>{p.numero}</td>
                        <td style={{ padding: '4px 8px' }}>{p.dataVencimento}</td>
                        <td style={{ textAlign: 'right', padding: '4px 8px' }}>
                          R$ {p.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ textAlign: 'right', padding: '4px 8px' }}>
                          {p.valorPago ? `R$ ${p.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td style={{ padding: '4px 8px' }}>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            }}
          />
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
                  {p.dataPagamento} - Parcela {p.numeroParcela} - R$ {p.valor?.toLocaleString('pt-BR')} - {p.status}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
