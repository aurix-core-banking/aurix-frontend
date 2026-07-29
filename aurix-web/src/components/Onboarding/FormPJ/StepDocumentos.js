import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Chip, IconButton } from '@mui/material';
import { UploadFile, Delete as DeleteIcon } from '@mui/icons-material';
import { apiService } from '../../../services/apiService';

function StepDocumentos({ solicitacaoId, onDocumentoChange }) {
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState('');

  const tipos = [
    { value: 'CONTRATO_SOCIAL', label: 'Contrato Social' },
    { value: 'CNPJ', label: 'Cartão CNPJ' },
    { value: 'IDENTIDADE', label: 'RG / CNH' },
    { value: 'COMPROVANTE_ENDERECO', label: 'Comprovante de Endereço' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  const handleFileChange = (tipo) => (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      try {
        await apiService.adicionarDocumentoPJ(solicitacaoId, {
          tipoDocumento: tipo,
          nomeArquivo: file.name,
          urlStorage: base64,
        });
        const newList = [...documentos, { tipoDocumento: tipo, nomeArquivo: file.name, validado: false }];
        setDocumentos(newList);
        if (onDocumentoChange) onDocumentoChange(newList.length);
      } catch (err) {
        setError('Erro ao enviar documento');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (index) => {
    setDocumentos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Documentos</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {tipos.map((t) => (
          <Box key={t.value}>
            <input
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id={`upload-${t.value}`}
              type="file"
              onChange={handleFileChange(t.value)}
            />
            <label htmlFor={`upload-${t.value}`}>
              <Button variant="outlined" component="span" startIcon={<UploadFile />}>
                {t.label}
              </Button>
            </label>
          </Box>
        ))}
      </Box>
      {documentos.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Arquivo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentos.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{tipos.find((t) => t.value === d.tipoDocumento)?.label || d.tipoDocumento}</TableCell>
                  <TableCell>{d.nomeArquivo}</TableCell>
                  <TableCell><Chip size="small" label={d.validado ? 'Validado' : 'Pendente'} color={d.validado ? 'success' : 'default'} /></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleRemoveDoc(i)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {documentos.length === 0 && <Typography variant="body2" color="text.secondary">Nenhum documento enviado</Typography>}
    </Box>
  );
}

export default StepDocumentos;
