import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Edit,
  Visibility,
  Download,
  Print,
  Share,
  QrCode
} from '@mui/icons-material';

const Contas = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [contas, setContas] = useState([]);
  const [extratoDialog, setExtratoDialog] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  useEffect(() => {
    const loadContas = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setContas([
        {
          id: 1,
          numero: '12345-6',
          agencia: '0001',
          tipo: 'Corrente',
          saldo: 15750.50,
          limite: 5000.00,
          status: 'Ativa',
          dataAbertura: '2020-01-15',
          rendimento: 0.5
        },
        {
          id: 2,
          numero: '67890-1',
          agencia: '0001',
          tipo: 'Poupança',
          saldo: 25000.00,
          limite: 0,
          status: 'Ativa',
          dataAbertura: '2020-01-15',
          rendimento: 0.5
        },
        {
          id: 3,
          numero: '11111-2',
          agencia: '0001',
          tipo: 'Investimento',
          saldo: 50000.00,
          limite: 0,
          status: 'Ativa',
          dataAbertura: '2021-03-10',
          rendimento: 1.2
        }
      ]);
      
      setLoading(false);
    };
    
    loadContas();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativa': return 'success';
      case 'Bloqueada': return 'error';
      case 'Suspensa': return 'warning';
      default: return 'default';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Corrente': return 'primary';
      case 'Poupança': return 'success';
      case 'Investimento': return 'info';
      default: return 'default';
    }
  };

  const handleExtrato = (conta) => {
    setContaSelecionada(conta);
    setExtratoDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
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
        {/* Resumo das Contas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                  Minhas Contas
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: 2 }}
                >
                  Nova Conta
                </Button>
              </Box>

              <Grid container spacing={3}>
                {contas.map((conta) => (
                  <Grid item xs={12} md={4} key={conta.id}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            {conta.tipo}
                          </Typography>
                          <Chip
                            label={conta.status}
                            color="success"
                            size="small"
                            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                          Agência: {conta.agencia}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                          Conta: {conta.numero}
                        </Typography>
                        
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {formatCurrency(conta.saldo)}
                        </Typography>
                        
                        {conta.limite > 0 && (
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Limite: {formatCurrency(conta.limite)}
                          </Typography>
                        )}
                        
                        {conta.rendimento > 0 && (
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Rendimento: {conta.rendimento}% a.m.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Contas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalhes das Contas
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Conta</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Saldo</TableCell>
                      <TableCell>Limite</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Data Abertura</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contas.map((conta) => (
                      <TableRow key={conta.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {conta.numero}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Ag. {conta.agencia}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={conta.tipo}
                            color={getTipoColor(conta.tipo)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(conta.saldo)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {conta.limite > 0 ? formatCurrency(conta.limite) : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={conta.status}
                            color={getStatusColor(conta.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {formatDate(conta.dataAbertura)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleExtrato(conta)}
                              title="Ver Extrato"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton size="small" title="Editar">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" title="Download">
                              <Download />
                            </IconButton>
                            <IconButton size="small" title="Imprimir">
                              <Print />
                            </IconButton>
                            <IconButton size="small" title="Compartilhar">
                              <Share />
                            </IconButton>
                            <IconButton size="small" title="QR Code">
                              <QrCode />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog Extrato */}
      <Dialog
        open={extratoDialog}
        onClose={() => setExtratoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Extrato - {contaSelecionada?.tipo} {contaSelecionada?.numero}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Data Inicial"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Data Final"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Extrato gerado com sucesso! Período: 01/01/2024 a 31/01/2024
          </Alert>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>15/01/2024</TableCell>
                  <TableCell>PIX recebido - João Silva</TableCell>
                  <TableCell sx={{ color: 'success.main' }}>+R$ 500,00</TableCell>
                  <TableCell>R$ 15.750,50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>14/01/2024</TableCell>
                  <TableCell>PIX enviado - Maria Santos</TableCell>
                  <TableCell sx={{ color: 'error.main' }}>-R$ 250,00</TableCell>
                  <TableCell>R$ 15.250,50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>13/01/2024</TableCell>
                  <TableCell>PIX recebido - Freelance</TableCell>
                  <TableCell sx={{ color: 'success.main' }}>+R$ 1.200,00</TableCell>
                  <TableCell>R$ 15.500,50</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtratoDialog(false)}>
            Fechar
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contas;
