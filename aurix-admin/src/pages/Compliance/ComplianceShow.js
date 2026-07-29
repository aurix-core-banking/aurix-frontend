import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  TabbedShowLayout,
  Tab,
} from 'react-admin';

export const ComplianceShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações de Compliance">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="nome" label="Nome" />
          <TextField source="tipoRegulacao" label="Tipo de Regulação" />
          <TextField source="descricao" label="Descrição" />
          <TextField source="documento" label="Documento" />
          <TextField source="status" label="Status" />
          <DateField source="dataCriacao" label="Data de Criação" />
          <DateField source="dataVencimento" label="Data de Vencimento" />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
