import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, MenuItem, Box, Chip, Typography,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
} from '@mui/material';
import { CloudUpload, CheckCircle, GppMaybe } from '@mui/icons-material';
import { fetchUtils } from 'react-admin';
import { getResourceUrl } from '../config/resources';

export const DocumentList = ({ documentos = [], solicitacaoId, onRefresh, resourceName = 'solicitacoes_pj', tipoOptions: propTipoOptions }) => {
  const [tipoDocumento, setTipoDocumento] = useState('RG');
  const [conteudo, setConteudo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [validarDialog, setValidarDialog] = useState({ open: false, doc: null });
  const [validarAcao, setValidarAcao] = useState('aprovar');
  const [validarObs, setValidarObs] = useState('');
  const [validarLoading, setValidarLoading] = useState(false);

  const tipoOptions = propTipoOptions || [
    'RG', 'CPF', 'COMPROVANTE_ENDERECO',
    'COMPROVANTE_RENDA', 'OUTROS',
    'CONTRATO_SOCIAL', 'CNPJ', 'IDENTIDADE_SOCIO',
    'BALANCO_PATRIMONIAL',
  ];

  const handleUpload = async () => {
    if (!conteudo) return;
    setUploading(true);
    try {
      const url = `${getResourceUrl(resourceName, solicitacaoId)}/documentos`;
      const token = localStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }),
        body: JSON.stringify({ tipoDocumento, conteudo }),
      };
      await fetchUtils.fetchJson(url, options);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(false);
    }
  };

  const handleValidarClick = (doc) => {
    setValidarDialog({ open: true, doc });
    setValidarAcao('aprovar');
    setValidarObs('');
  };

  const handleValidarConfirm = async () => {
    setValidarLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      });
      const url = `${getResourceUrl(resourceName, solicitacaoId)}/documentos/${validarDialog.doc.id}/validar`;
      await fetchUtils.fetchJson(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          validado: validarAcao === 'aprovar',
          observacao: validarObs || null,
        }),
      });
      setValidarDialog({ open: false, doc: null });
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Validation failed', e);
    } finally {
      setValidarLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          select
          label="Tipo Documento"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          {tipoOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Base64 do arquivo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          multiline
          maxRows={3}
          sx={{ flex: 1 }}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          disabled={uploading || !conteudo}
        >
          {uploading ? 'Enviando...' : 'Upload'}
        </Button>
      </Box>

      {documentos.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum documento enviado
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Arquivo</TableCell>
                <TableCell>Validado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentos.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.tipoDocumento}</TableCell>
                  <TableCell>{doc.nomeArquivo}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.validado ? 'Sim' : 'Não'}
                      color={doc.validado ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={doc.validado ? 'Documento já validado' : 'Validar documento'}>
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={doc.validado}
                          onClick={() => handleValidarClick(doc)}
                        >
                          {doc.validado ? <CheckCircle /> : <GppMaybe />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={validarDialog.open} onClose={() => setValidarDialog({ open: false, doc: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Validar Documento</DialogTitle>
        <DialogContent>
          {validarDialog.doc && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Tipo:</strong> {validarDialog.doc.tipoDocumento}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Arquivo:</strong> {validarDialog.doc.nomeArquivo}
              </Typography>
              <FormControl sx={{ mt: 2, mb: 2 }}>
                <FormLabel>Decisão</FormLabel>
                <RadioGroup row value={validarAcao} onChange={(e) => setValidarAcao(e.target.value)}>
                  <FormControlLabel value="aprovar" control={<Radio />} label="Aprovar" />
                  <FormControlLabel value="rejeitar" control={<Radio />} label="Rejeitar" />
                </RadioGroup>
              </FormControl>
              <TextField
                label="Observação"
                fullWidth
                multiline
                rows={3}
                value={validarObs}
                onChange={(e) => setValidarObs(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidarDialog({ open: false, doc: null })}>Cancelar</Button>
          <Button variant="contained" onClick={handleValidarConfirm} disabled={validarLoading}>
            {validarLoading ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
