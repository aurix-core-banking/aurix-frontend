import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Table, TableBody, TableCell, TableRow, Alert, CircularProgress, Button } from '@mui/material';
import { CheckCircle, HourglassEmpty, Cancel, ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/apiService';

const statusColors = {
  EM_PREENCHIMENTO: 'default',
  CNPJ_CONSULTADO: 'info',
  SOCIOS_VALIDADOS: 'info',
  DOCUMENTOS_ANALISADOS: 'info',
  AML_APROVADO: 'info',
  COMPLIANCE_APROVADO: 'info',
  EM_ASSINATURA: 'warning',
  CONTRATO_ASSINADO: 'success',
  CONTA_CRIADA: 'success',
  REJEITADA: 'error',
};

const statusLabels = {
  EM_PREENCHIMENTO: 'Em preenchimento',
  CNPJ_CONSULTADO: 'CNPJ consultado',
  SOCIOS_VALIDADOS: 'Sócios validados',
  DOCUMENTOS_ANALISADOS: 'Documentos analisados',
  AML_APROVADO: 'AML aprovado',
  COMPLIANCE_APROVADO: 'Compliance aprovado',
  EM_ASSINATURA: 'Em assinatura',
  CONTRATO_ASSINADO: 'Contrato assinado',
  CONTA_CRIADA: 'Conta criada',
  REJEITADA: 'Rejeitada',
};

function TrackingPJ({ solicitacaoId, onNew }) {
  const [solicitacao, setSolicitacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getSolicitacaoPJ(solicitacaoId);
      setSolicitacao(res.data);
    } catch (err) {
      setError('Não foi possível carregar os dados da solicitação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [solicitacaoId]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!solicitacao) return null;

  const statusColor = statusColors[solicitacao.status] || 'default';
  const isRejected = solicitacao.status === 'REJEITADA';
  const isApproved = solicitacao.status === 'CONTA_CRIADA' || solicitacao.status === 'CONTRATO_ASSINADO';

  const details = [
    ['CNPJ', solicitacao.cnpj],
    ['Razão Social', solicitacao.razaoSocial],
    ['Nome Fantasia', solicitacao.nomeFantasia],
    ['E-mail', solicitacao.email],
    ['Telefone', solicitacao.telefone],
    ['Criada em', solicitacao.dataCriacao ? format(new Date(solicitacao.dataCriacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'],
    ['Atualizada em', solicitacao.dataAtualizacao ? format(new Date(solicitacao.dataAtualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'],
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h5">Solicitação #{solicitacao.id}</Typography>
        <Chip label={statusLabels[solicitacao.status] || solicitacao.status} color={statusColor} />
        {isRejected && <Chip icon={<Cancel />} label="Rejeitada" color="error" />}
        {isApproved && <Chip icon={<CheckCircle />} label="Aprovada" color="success" />}
      </Box>

      {solicitacao.observacoesAnalista && (
        <Alert severity={isRejected ? 'error' : 'info'} sx={{ mb: 2 }}>
          {solicitacao.observacoesAnalista}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Dados da solicitação</Typography>
          <Table size="small">
            <TableBody>
              {details.map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell sx={{ fontWeight: 600, width: 200 }}>{label}</TableCell>
                  <TableCell>{value || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {solicitacao.historico && solicitacao.historico.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Histórico</Typography>
            {solicitacao.historico.map((h, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <HourglassEmpty fontSize="small" color="action" />
                <Typography variant="body2">
                  {h.acao} — {h.usuarioAnalista ? `${h.usuarioAnalista} — ` : ''}{h.dataAcao ? format(new Date(h.dataAcao), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : ''}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {solicitacao.documentos && solicitacao.documentos.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Documentos</Typography>
            {solicitacao.documentos.map((d, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <Chip size="small" label={d.validado ? 'OK' : 'Pendente'} color={d.validado ? 'success' : 'default'} />
                <Typography variant="body2">{d.tipoDocumento}: {d.nomeArquivo}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Button variant="outlined" startIcon={<ArrowBack />} onClick={onNew}>
        Nova solicitação
      </Button>
    </Box>
  );
}

export default TrackingPJ;
