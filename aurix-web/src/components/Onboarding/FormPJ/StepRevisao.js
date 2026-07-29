import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';

function StepRevisao({ form, sociosCount, documentosCount, solicitacaoId }) {
  const formatCNPJ = (v) => v ? v.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') : '-';

  const rows = [
    ['CNPJ', formatCNPJ(form.cnpj)],
    ['Razão Social', form.razaoSocial],
    ['Nome Fantasia', form.nomeFantasia || '-'],
    ['E-mail', form.email],
    ['Telefone', form.telefone || '-'],
    ['Endereço', form.endereco || '-'],
    ['Sócios', `${sociosCount} adicionado(s)`],
    ['Documentos', `${documentosCount} enviado(s)`],
  ];

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Revisar dados</Typography>
      <Table size="small">
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell sx={{ fontWeight: 600, width: 200 }}>{label}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Solicitação #{solicitacaoId} criada com sucesso. Você pode adicionar mais sócios e documentos depois.
      </Typography>
    </Box>
  );
}

export default StepRevisao;
