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
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
  FunctionField,
} from 'react-admin';

const ComplianceFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoAlerta"
      choices={[
        { id: 'AML', name: 'AML (Antilavagem)' },
        { id: 'COAF', name: 'Notificação COAF' },
        { id: 'PEP', name: 'PEP' },
        { id: 'SANCAO', name: 'Sanção' },
        { id: 'LISTA_NEGRA', name: 'Lista Negra' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ABERTO', name: 'Aberto' },
        { id: 'EM_INVESTIGACAO', name: 'Em Investigação' },
        { id: 'ENVIADO_COAF', name: 'Enviado COAF' },
        { id: 'RESOLVIDO', name: 'Resolvido' },
        { id: 'FECHADO', name: 'Fechado' },
      ]}
    />
    <SelectInput
      source="gravidade"
      choices={[
        { id: 'BAIXA', name: 'Baixa' },
        { id: 'MEDIA', name: 'Média' },
        { id: 'ALTA', name: 'Alta' },
        { id: 'CRITICA', name: 'Crítica' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

export const ComplianceList = (props) => (
  <List
    {...props}
    filters={<ComplianceFilter />}
    actions={<ListActions />}
    sort={{ field: 'dataCriacao', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="tipoAlerta" label="Tipo Alerta" />
      <FunctionField label="Cliente" render={(r) => r?.cliente?.nome || '-'} />
      <TextField source="descricao" label="Descrição" />
      <TextField source="gravidade" label="Gravidade" />
      <TextField source="status" label="Status" />
      <DateField source="dataCriacao" label="Data Criação" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ComplianceShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Alerta">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="tipoAlerta" label="Tipo de Alerta" />
          <FunctionField label="Cliente" render={(r) => r?.cliente?.nome || '-'} />
          <FunctionField label="Documento" render={(r) => r?.cliente?.documento || '-'} />
          <TextField source="descricao" label="Descrição" />
          <TextField source="gravidade" label="Gravidade" />
          <TextField source="status" label="Status" />
          <DateField source="dataCriacao" label="Data Criação" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Investigação">
        <SimpleShowLayout>
          <TextField source="analistaResponsavel" label="Analista Responsável" />
          <TextField source="motivoAlerta" label="Motivo do Alerta" />
          <TextField source="evidencias" label="Evidências" />
          <FunctionField
            label="Documentos Anexos"
            render={(record) => {
              if (!record?.documentos?.length) return 'Nenhum documento anexado';
              return record.documentos.map((d) => (
                <div key={d.id}>{d.nome} ({d.tipo})</div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Timeline">
        <SimpleShowLayout>
          <FunctionField
            label="Timeline"
            render={(record) => {
              if (!record?.timeline?.length) return 'Nenhum evento registrado';
              return record.timeline.map((t) => (
                <div key={t.id} style={{ marginBottom: 8 }}>
                  <strong>{t.data}</strong> - {t.descricao}
                  <br />
                  <span style={{ color: '#666' }}>Por: {t.usuario}</span>
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Notificações COAF">
        <SimpleShowLayout>
          <FunctionField
            label="Notificações"
            render={(record) => {
              if (!record?.notificacoesCoaf?.length) return 'Nenhuma notificação COAF';
              return record.notificacoesCoaf.map((n) => (
                <div key={n.id}>
                  {n.dataEnvio} - Protocolo: {n.protocolo} - {n.status}
                </div>
              ));
            }}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
