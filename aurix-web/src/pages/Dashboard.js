import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Payment,
  Security,
  Notifications,
  Refresh,
  Add,
  ArrowUpward,
  ArrowDownward,
  Pix,
  SwapHoriz,
  Description
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { apiService } from '../services/apiService';

const Dashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [pixDialog, setPixDialog] = useState(false);
  const [pixData, setPixData] = useState({ chave: '', valor: '', descricao: '' });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const contas = await apiService.getContas();
        const total = (contas || []).reduce((sum, c) => sum + (c.saldo || 0), 0);
        setSaldo(total || user?.conta?.saldo || 0);

        const trans = await apiService.getTransacoes(user?.contaId || 1, {});
        setTransacoes((trans || []).slice(0, 5));

        try {
          const inv = await apiService.getInvestimentos(user?.contaId || 1);
          setInvestimentos(inv || []);
        } catch (e) { /* opcional */ }

        try {
          const cards = await apiService.getCartoes(user?.contaId || 1);
          setCartoes(cards || []);
        } catch (e) { /* opcional */ }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handlePixSend = async () => {
    try {
      await apiService.enviarPix({ chaveDestino: pixData.chave, valor: parseFloat(pixData.valor), descricao: pixData.descricao });
      setPixDialog(false);
      setPixData({ chave: '', valor: '', descricao: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  // Dados para gráficos
  const saldoHistory = [
    { mes: 'Jan', saldo: 12000 },
    { mes: 'Fev', saldo: 13500 },
    { mes: 'Mar', saldo: 14200 },
    { mes: 'Abr', saldo: 15100 },
    { mes: 'Mai', saldo: 15750 }
  ];

  const investimentosData = [
    { name: 'CDB', value: 10000, color: '#8884d8' },
    { name: 'LCI', value: 5000, color: '#82ca9d' },
    { name: 'Fundo DI', value: 2500, color: '#ffc658' }
  ];

  if (loading) {
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
        {/* Saldo Principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Saldo Disponível</Typography>
                <IconButton color="inherit" onClick={() => window.location.reload()}>
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

        {/* Resumo Financeiro */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Resumo Financeiro</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Receitas (mês)</Typography>
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(1700.00)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Despesas (mês)</Typography>
                  <Typography variant="body2" color="error.main">
                    {formatCurrency(1250.00)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Investimentos</Typography>
                  <Typography variant="body2" color="info.main">
                    {formatCurrency(17500.00)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Saldo Líquido</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(450.00)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Saldo */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Evolução do Saldo</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={saldoHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="saldo" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Investimentos */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Investimentos</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={investimentosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {investimentosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <List dense>
                {investimentos.map((investimento) => (
                  <ListItem key={investimento.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={investimento.nome}
                      secondary={`${formatCurrency(investimento.valor)} • ${investimento.percentual}%`}
                    />
                    <Typography variant="body2" color="success.main">
                      +{formatCurrency(investimento.rendimento)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Transações Recentes */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Transações Recentes</Typography>
                <Button size="small" startIcon={<Add />}>
                  Ver Todas
                </Button>
              </Box>
              <List>
                {transacoes.map((transacao) => (
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
            </CardContent>
          </Card>
        </Grid>

        {/* Cartões */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cartões</Typography>
              {cartoes.map((cartao) => (
                <Box key={cartao.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {cartao.tipo} • {cartao.numero}
                  </Typography>
                  {cartao.tipo === 'Crédito' && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Utilizado</Typography>
                        <Typography variant="body2">
                          {formatCurrency(cartao.utilizado)} / {formatCurrency(cartao.limite)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(cartao.utilizado / cartao.limite) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Vence em {new Date(cartao.vencimento).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog PIX */}
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
          <Button onClick={handlePixSend} variant="contained">
            Enviar PIX
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
