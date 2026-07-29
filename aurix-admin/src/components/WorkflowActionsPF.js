import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Typography, Alert,
} from '@mui/material';
import {
  CheckCircle, Cancel, Assignment,
} from '@mui/icons-material';
import { fetchUtils } from 'react-admin';
import { getActionUrl } from '../config/resources';

const ACTION_CONFIG = {
  RECEBIDA: [
    { action: 'kyc', label: 'Enviar para KYC', icon: <Assignment />, color: 'info' },
  ],
  DOCUMENTOS_PENDENTES: [
    { action: 'kyc', label: 'Enviar para KYC', icon: <Assignment />, color: 'info' },
  ],
  KYC_REJEITADO: [
    { action: 'kyc', label: 'Reenviar para KYC', icon: <Assignment />, color: 'info' },
  ],
  KYC_APROVADO: [
    { action: 'aprovar', label: 'Aprovar (criar cliente)', icon: <CheckCircle />, color: 'success' },
  ],
};

const STATUS_LABELS = {
  RECEBIDA: 'Recebida',
  DOCUMENTOS_PENDENTES: 'Documentos Pendentes',
  EM_ANALISE_KYC: 'Em Análise KYC',
  KYC_APROVADO: 'KYC Aprovado',
  KYC_REJEITADO: 'KYC Rejeitado',
  APROVADA: 'Aprovada',
  CONTA_CRIADA: 'Conta Criada',
  REJEITADA: 'Rejeitada',
};

export const WorkflowActionsPF = ({ solicitacaoId, statusAtual, onRefresh }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const actions = ACTION_CONFIG[statusAtual] || [];
  const canReject = !['APROVADA', 'CONTA_CRIADA', 'REJEITADA'].includes(statusAtual);

  const handleActionClick = (action) => {
    setPendingAction(action);
    setObservacao('');
    setError('');
    setConfirmOpen(true);
  };

  const handleRejectClick = () => {
    setPendingAction('rejeitar');
    setObservacao('');
    setError('');
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      });

      if (pendingAction === 'rejeitar') {
        const url = `${getActionUrl('solicitacoes_conta', solicitacaoId, 'rejeitar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
      } else if (pendingAction === 'aprovar') {
        const url = `${getActionUrl('solicitacoes_conta', solicitacaoId, 'aprovar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
      } else if (pendingAction === 'kyc') {
        const url = getActionUrl('solicitacoes_conta', solicitacaoId, 'kyc');
        await fetchUtils.fetchJson(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ documentos: [], selfieBase64: '' }),
        });
      }

      setConfirmOpen(false);
      if (onRefresh) onRefresh();
    } catch (e) {
      setError(e.message || 'Erro ao executar ação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Status Atual: {STATUS_LABELS[statusAtual] || statusAtual}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {actions.map(({ action, label, icon, color }) => (
          <Button
            key={action}
            variant="contained"
            color={color}
            startIcon={icon}
            onClick={() => handleActionClick(action)}
          >
            {label}
          </Button>
        ))}
        {canReject && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={handleRejectClick}
          >
            Rejeitar
          </Button>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {pendingAction === 'rejeitar' ? 'Rejeitar Solicitação' : `Confirmar: ${pendingAction}`}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <DialogContentText>
            {pendingAction === 'rejeitar'
              ? 'Tem certeza que deseja rejeitar esta solicitação? Informe o motivo:'
              : pendingAction === 'aprovar'
                ? 'Tem certeza que deseja aprovar esta solicitação? O cliente e a conta serão criados automaticamente.'
                : 'Tem certeza que deseja enviar para validação KYC?'}
          </DialogContentText>
          {(pendingAction === 'rejeitar' || pendingAction === 'aprovar') && (
            <TextField
              autoFocus
              margin="dense"
              label="Observação"
              fullWidth
              multiline
              rows={3}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Executando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
