import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField, DateField } from 'react-admin';

export const FuncionarioShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="matricula" label="Matricula" />
      <TextField source="nomeCompleto" label="Nome" />
      <TextField source="cpf" label="CPF" />
      <TextField source="email" label="Email" />
      <TextField source="telefone" label="Telefone" />
      <NumberField source="empresaId" label="Empresa ID" />
      <NumberField source="departamentoId" label="Departamento ID" />
      <NumberField source="cargoId" label="Cargo ID" />
      <NumberField source="gestorId" label="Gestor ID" />
      <TextField source="status" label="Status" />
      <DateField source="dataAdmissao" label="Admissao" />
      <DateField source="dataDemissao" label="Demissao" />
      <NumberField source="salarioAtual" label="Salario" options={{ minimumFractionDigits: 2 }} />
      <DateField source="dataCriacao" label="Criado" showTime />
      <DateField source="dataAtualizacao" label="Atualizado" showTime />
    </SimpleShowLayout>
  </Show>
);
