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
} from 'react-admin';

const AuditoriaFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="tipoAcao"
      choices={[
        { id: 'CREATE', name: 'Criar' },
        { id: 'UPDATE', name: 'Atualizar' },
        { id: 'DELETE', name: 'Deletar' },
        { id: 'LOGIN', name: 'Login' },
        { id: 'LOGOUT', name: 'Logout' },
      ]}
    />
    <SelectInput
      source="nivel"
      choices={[
        { id: 'INFO', name: 'Info' },
        { id: 'WARN', name: 'Aviso' },
        { id: 'ERROR', name: 'Erro' },
        { id: 'CRITICAL', name: 'Crítico' },
      ]}
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

export const AuditoriaList = (props) => (
  <List
    {...props}
    filters={<AuditoriaFilter />}
    actions={<ListActions />}
    sort={{ field: 'timestamp', order: 'DESC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="usuario" label="Usuário" />
      <TextField source="tipoAcao" label="Ação" />
      <TextField source="entidade" label="Entidade" />
      <TextField source="entidadeId" label="ID Entidade" />
      <TextField source="nivel" label="Nível" />
      <TextField source="mensagem" label="Mensagem" />
      <DateField source="timestamp" label="Data/Hora" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
