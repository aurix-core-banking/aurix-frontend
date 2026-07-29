import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Snackbar, Alert,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { fetchUtils, useListContext } from 'react-admin';
import { getActionUrl } from '../config/resources';

export const BulkApproveReject = ({ selectedIds, resourceName }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [observacao, setObservacao] = useState('');
  const { refetch } = useListContext();
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleClick = (tipo) => {
    setAction(tipo);
    setObservacao('');
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setProcessing(true);
    const token = localStorage.getItem('token');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    });
    let success = 0;
    let errors = 0;
    for (const id of selectedIds) {
      try {
        let url;
        if (action === 'rejeitar') {
          url = `${getActionUrl(resourceName, id, 'rejeitar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        } else {
          url = `${getActionUrl(resourceName, id, 'aprovar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        }
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
        success++;
      } catch (e) {
        errors++;
      }
    }
    setProcessing(false);
    setConfirmOpen(false);
    const message = errors > 0
      ? `${success} processada(s), ${errors} erro(s)`
      : `${success} solicitação(ões) ${action === 'aprovar' ? 'aprovada(s)' : 'rejeitada(s)'} com sucesso`;
    setSnackbar({ open: true, message, severity: errors > 0 && success === 0 ? 'error' : 'success' });
    refetch();
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleClick('aprovar')}
          >
            Aprovar ({selectedIds.length})
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleClick('rejeitar')}
          >
            Rejeitar ({selectedIds.length})
          </Button>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'aprovar' ? 'Aprovar Solicitações' : 'Rejeitar Solicitações'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {action === 'aprovar'
              ? `Deseja aprovar ${selectedIds.length} solicitação(ões)? Os clientes e contas serão criados automaticamente.`
              : `Deseja rejeitar ${selectedIds.length} solicitação(ões)? Informe o motivo abaixo.`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Observação (opcional)"
            fullWidth
            multiline
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={processing}>
            {processing ? 'Processando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
