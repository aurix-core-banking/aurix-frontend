import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  ArrowBack,
  Download,
  Receipt,
  TrendingUp,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import { apiService } from '../../services/apiService';

const fetchConta = async (id) => {
  const data = await apiService.getConta(id);
  return data;
};

const fetchExtrato = async (contaId) => {
  const data = await apiService.getExtratoConta(contaId);
  return Array.isArray(data) ? data : [];
};

const DetalhesConta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: conta, isLoading: carregandoConta, error: erroConta } = useQuery(
    ['conta', id],
    () => fetchConta(id),
    { retry: 1, enabled: !!id }
  );

  const { data: extrato = [], isLoading: carregandoExtrato } = useQuery(
    ['extrato', id],
    () => fetchExtrato(id),
    { retry: 1, enabled: !!id }
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVA': return 'success';
      case 'BLOQUEADA': return 'error';
      case 'SUSPENSA': return 'warning';
      default: return 'default';
    }
  };

  if (carregandoConta) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (erroConta) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Erro ao carregar detalhes da conta.</Alert>
      </Box>
    );
  }

  if (!conta) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Conta não encontrada.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/contas')}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance />
                  <Typography variant="h6">{conta.tipo}</Typography>
                </Box>
                <Chip
                  label={conta.status}
                  color="success"
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                {formatCurrency(conta.saldo)}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Agência</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{conta.agencia}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Conta</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{conta.numero}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Data Abertura</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(conta.dataAbertura)}
                  </Typography>
                </Grid>
                {conta.limite > 0 && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Limite</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatCurrency(conta.limite)}
                    </Typography>
                  </Grid>
                )}
                {conta.rendimento > 0 && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Rendimento</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {conta.rendimento}% a.m.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Ações</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Receipt />}
                  onClick={() => navigate('/extrato', { state: { contaId: id } })}
                >
                  Ver Extrato
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Download />}
                >
                  Download Comprovante
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Extrato Recente</Typography>
              <Divider sx={{ mb: 2 }} />
              {carregandoExtrato ? (
                <Box>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="text" width="100%" height={50} />
                  ))}
                </Box>
              ) : extrato.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">Nenhuma movimentação encontrada</Typography>
                </Box>
              ) : (
                <Box>
                  {extrato.slice(0, 10).map((item, index) => (
                    <Box
                      key={item.id || index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: index < extrato.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.descricao || item.tipo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.data)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: item.valor > 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {item.valor > 0 ? '+' : ''}{formatCurrency(item.valor)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetalhesConta;
