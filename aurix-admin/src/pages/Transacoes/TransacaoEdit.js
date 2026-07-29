import React from 'react';
import {
  Edit,
  SimpleForm,
  SelectInput,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  TextInput,
  required,
  minValue,
} from 'react-admin';

export const TransacaoEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <SelectInput
        source="tipoTransacao"
        label="Tipo de Transação"
        choices={[
          { id: 'DEPOSITO', name: 'Depósito' },
          { id: 'SAQUE', name: 'Saque' },
          { id: 'TRANSFERENCIA', name: 'Transferência' },
          { id: 'PAGAMENTO', name: 'Pagamento' },
          { id: 'PIX', name: 'PIX' },
        ]}
        validate={[required()]}
      />
      <NumberInput
        source="valor"
        label="Valor"
        validate={[required(), minValue(0.01)]}
        step={0.01}
      />
      <ReferenceInput source="contaOrigemId" reference="contas">
        <AutocompleteInput
          optionText={(record) => `${record.numero} - ${record.cliente?.nome || ''}`}
          label="Conta Origem"
          validate={[required()]}
        />
      </ReferenceInput>
      <ReferenceInput source="contaDestinoId" reference="contas">
        <AutocompleteInput
          optionText={(record) => `${record.numero} - ${record.cliente?.nome || ''}`}
          label="Conta Destino"
        />
      </ReferenceInput>
      <TextInput source="descricao" label="Descrição" multiline rows={3} />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'PENDENTE', name: 'Pendente' },
          { id: 'PROCESSADA', name: 'Processada' },
          { id: 'CANCELADA', name: 'Cancelada' },
          { id: 'FALHADA', name: 'Falhada' },
        ]}
        validate={[required()]}
      />
    </SimpleForm>
  </Edit>
);
