import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Typography, Alert,
} from '@mui/material';
import {
  CheckCircle, Cancel, Gavel, Security, Edit, HowToReg, Search, Assignment,
} from '@mui/icons-material';
import { fetchUtils } from 'react-admin';
import { getActionUrl } from '../config/resources';

const ACTION_CONFIG = {
  'EM_PREENCHIMENTO': [
    { action: 'validar-cnpj', label: 'Validar CNPJ', icon: <Search />, color: 'primary' },
  ],
  'CNPJ_CONSULTADO': [
    { action: 'aml-aprovar', label: 'Aprovar AML', icon: <Gavel />, color: 'secondary' },
  ],
  'SOCIOS_VALIDADOS': [
    { action: 'aml-aprovar', label: 'Aprovar AML', icon: <Gavel />, color: 'secondary' },
  ],
  'DOCUMENTOS_ANALISADOS': [
    { action: 'aml-aprovar', label: 'Aprovar AML', icon: <Gavel />, color: 'secondary' },
  ],
  'AML_APROVADO': [
    { action: 'compliance-aprovar', label: 'Aprovar Compliance', icon: <Security />, color: 'info' },
  ],
  'COMPLIANCE_APROVADO': [
    { action: 'assinatura-solicitar', label: 'Solicitar Assinatura', icon: <Edit />, color: 'warning' },
  ],
  'EM_ASSINATURA': [
    { action: 'assinatura-confirmar', label: 'Confirmar Assinatura', icon: <HowToReg />, color: 'success' },
  ],
};

const STATUS_LABELS = {
  RECEBIDA: 'Recebida', EM_PREENCHIMENTO: 'Em Preenchimento',
  CNPJ_CONSULTADO: 'CNPJ Consultado', SOCIOS_VALIDADOS: 'Sócios Validados',
  DOCUMENTOS_PENDENTES: 'Documentos Pendentes', DOCUMENTOS_ANALISADOS: 'Documentos Analisados',
  EM_ANALISE_KYC: 'Em Análise KYC', KYC_APROVADO: 'KYC Aprovado',
  KYC_REJEITADO: 'KYC Rejeitado', EM_ANALISE_MANUAL: 'Em Análise Manual',
  AML_APROVADO: 'AML Aprovado', COMPLIANCE_APROVADO: 'Compliance Aprovado',
  EM_ASSINATURA: 'Em Assinatura', CONTRATO_ASSINADO: 'Contrato Assinado',
  APROVADA: 'Aprovada', CONTA_CRIADA: 'Conta Criada', REJEITADA: 'Rejeitada',
};

export const WorkflowActions = ({ solicitacaoId, statusAtual, onRefresh }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const actions = ACTION_CONFIG[statusAtual] || [];
  const canReject = !['APROVADA', 'CONTA_CRIADA', 'REJEITADA', 'CONTRATO_ASSINADO'].includes(statusAtual);

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
        const url = `${getActionUrl('solicitacoes_pj', solicitacaoId, 'rejeitar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
      } else if (pendingAction === 'aprovar') {
        const url = `${getActionUrl('solicitacoes_pj', solicitacaoId, 'aprovar')}?usuarioAnalista=admin&observacao=${encodeURIComponent(observacao)}`;
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
      } else if (pendingAction === 'assinatura-solicitar') {
        const url = getActionUrl('solicitacoes_pj', solicitacaoId, 'assinatura-solicitar');
        await fetchUtils.fetchJson(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ tipoAssinatura: observacao || 'eletronica' }),
        });
      } else {
        const url = getActionUrl('solicitacoes_pj', solicitacaoId, pendingAction);
        await fetchUtils.fetchJson(url, { method: 'POST', headers });
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
              : `Tem certeza que deseja executar a ação "${pendingAction}"?`}
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
          {pendingAction === 'assinatura-solicitar' && (
            <TextField
              autoFocus
              margin="dense"
              label="Tipo de Assinatura"
              fullWidth
              value={observacao || 'eletronica'}
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
