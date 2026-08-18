import React, { useState, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Payment,
  Refresh,
  Add,
  Pix,
  SwapHoriz,
  Description,
  ErrorOutline,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'react-query';

import { apiService } from '../services/apiService';

const fetchContas = async () => {
  const data = await apiService.getContas();
  return Array.isArray(data) ? data : [];
};

const fetchTransacoes = async (contaId) => {
  if (!contaId) return [];
  const data = await apiService.getTransacoes(contaId, {});
  return Array.isArray(data) ? data : [];
};

const fetchInvestimentos = async (contaId) => {
  if (!contaId) return [];
  const data = await apiService.getInvestimentos(contaId);
  return Array.isArray(data) ? data : [];
};

const fetchCartoes = async (contaId) => {
  if (!contaId) return [];
  const data = await apiService.getCartoes(contaId);
  return Array.isArray(data) ? data : [];
};

const Dashboard = ({ user }) => {
  const [pixDialog, setPixDialog] = useState(false);
  const [pixData, setPixData] = useState({ chave: '', valor: '', descricao: '' });

  const contaId = user?.contaId || user?.conta?.id || '1';

  const { data: contas = [], isLoading: carregandoContas } = useQuery(
    'contas',
    fetchContas,
    { retry: 1, staleTime: 30000 }
  );

  const { data: transacoes = [], isLoading: carregandoTransacoes } = useQuery(
    ['transacoes', contaId],
    () => fetchTransacoes(contaId),
    { retry: 1, staleTime: 15000, enabled: !!contaId }
  );

  const { data: investimentos = [], isLoading: carregandoInvestimentos } = useQuery(
    ['investimentos', contaId],
    () => fetchInvestimentos(contaId),
    { retry: 1, staleTime: 30000, enabled: !!contaId }
  );

  const { data: cartoes = [], isLoading: carregandoCartoes } = useQuery(
    ['cartoes', contaId],
    () => fetchCartoes(contaId),
    { retry: 1, staleTime: 30000, enabled: !!contaId }
  );

  const saldo = contas.reduce((sum, c) => sum + (c.saldo || 0), 0);
  const transacoesRecentes = transacoes.slice(0, 5);

  const handlePixSend = async () => {
    try {
      await apiService.enviarPix({
        chaveDestino: pixData.chave,
        valor: parseFloat(pixData.valor),
        descricao: pixData.descricao,
      });
      setPixDialog(false);
      setPixData({ chave: '', valor: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'PIX': return <Pix />;
      case 'TED': return <SwapHoriz />;
      case 'DOC': return <Description />;
      default: return <Payment />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'success';
      case 'processando': return 'warning';
      case 'erro': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'processando': return 'Processando';
      case 'erro': return 'Erro';
      default: return status;
    }
  };

  const carregando = carregandoContas || carregandoTransacoes;

  if (carregando) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" height={150} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Saldo Disponível</Typography>
                <IconButton color="inherit">
                  <Refresh />
                </IconButton>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatCurrency(saldo)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Pix />}
                  onClick={() => setPixDialog(true)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                >
                  Enviar PIX
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SwapHoriz />}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                >
                  TED
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Description />}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                >
                  DOC
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Resumo Financeiro</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Receitas (mês)</Typography>
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(transacoesRecentes.filter(t => t.valor > 0).reduce((s, t) => s + t.valor, 0) || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Despesas (mês)</Typography>
                  <Typography variant="body2" color="error.main">
                    {formatCurrency(Math.abs(transacoesRecentes.filter(t => t.valor < 0).reduce((s, t) => s + t.valor, 0) || 0))}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Investimentos</Typography>
                  <Typography variant="body2" color="info.main">
                    {formatCurrency(investimentos.reduce((s, i) => s + (i.valor || i.valorInvestido || 0), 0))}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Saldo Líquido</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(saldo)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Transações Recentes</Typography>
              {transacoesRecentes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Payment sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">Nenhuma transação encontrada</Typography>
                </Box>
              ) : (
                <List>
                  {transacoesRecentes.map((transacao) => (
                    <ListItem key={transacao.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getTipoIcon(transacao.tipo)}
                      </ListItemIcon>
                      <ListItemText
                        primary={transacao.descricao}
                        secondary={formatDate(transacao.data)}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color={transacao.valor > 0 ? 'success.main' : 'error.main'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {transacao.valor > 0 ? '+' : ''}{formatCurrency(transacao.valor)}
                        </Typography>
                        <Chip
                          label={getStatusLabel(transacao.status)}
                          color={getStatusColor(transacao.status)}
                          size="small"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Investimentos</Typography>
              {investimentos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">Nenhum investimento</Typography>
                </Box>
              ) : (
                <List dense>
                  {investimentos.map((investimento) => (
                    <ListItem key={investimento.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={investimento.nome || investimento.tipo}
                        secondary={`${formatCurrency(investimento.valor || investimento.valorInvestido)} • ${investimento.percentual || investimento.taxa}%`}
                      />
                      <Typography variant="body2" color="success.main">
                        +{formatCurrency(investimento.rendimento || 0)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cartões</Typography>
              {cartoes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">Nenhum cartão</Typography>
                </Box>
              ) : (
                cartoes.map((cartao) => (
                  <Box key={cartao.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {cartao.tipo || cartao.bandeira} • {cartao.numero}
                    </Typography>
                    {cartao.limite > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Utilizado</Typography>
                          <Typography variant="body2">
                            {formatCurrency(cartao.utilizado || 0)} / {formatCurrency(cartao.limite)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={cartao.limite ? ((cartao.utilizado || 0) / cartao.limite) * 100 : 0}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={pixDialog} onClose={() => setPixDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enviar PIX</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chave PIX"
            fullWidth
            variant="outlined"
            value={pixData.chave}
            onChange={(e) => setPixData({ ...pixData, chave: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Valor"
            fullWidth
            variant="outlined"
            type="number"
            value={pixData.valor}
            onChange={(e) => setPixData({ ...pixData, valor: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={pixData.descricao}
            onChange={(e) => setPixData({ ...pixData, descricao: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPixDialog(false)}>Cancelar</Button>
          <Button onClick={handlePixSend} variant="contained" disabled={!pixData.chave || !pixData.valor}>
            Enviar PIX
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
