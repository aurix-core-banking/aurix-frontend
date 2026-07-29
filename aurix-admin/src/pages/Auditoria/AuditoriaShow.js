import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  TabbedShowLayout,
  Tab,
  FunctionField,
} from 'react-admin';

const DetalhesField = ({ record }) => {
  if (!record?.detalhes) return null;
  return JSON.stringify(record.detalhes, null, 2);
};

export const AuditoriaShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Informações da Auditoria">
        <SimpleShowLayout>
          <TextField source="id" label="ID" />
          <TextField source="usuario" label="Usuário" />
          <TextField source="tipoAcao" label="Tipo de Ação" />
          <TextField source="entidade" label="Entidade" />
          <TextField source="entidadeId" label="ID da Entidade" />
          <TextField source="nivel" label="Nível" />
          <TextField source="mensagem" label="Mensagem" />
          <DateField source="timestamp" label="Data/Hora" showTime />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Detalhes">
        <SimpleShowLayout>
          <FunctionField
            label="Detalhes (JSON)"
            render={DetalhesField}
          />
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
