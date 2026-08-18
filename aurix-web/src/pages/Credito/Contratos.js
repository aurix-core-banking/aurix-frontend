import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Description,
  ExpandMore,
  ExpandLess,
  Payments,
  TrendingDown,
  CheckCircle,
} from '@mui/icons-material';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/apiService';

function Contratos({ user }) {
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState([]);
  const [contratoExpandido, setContratoExpandido] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [detalheOpen, setDetalheOpen] = useState(false);
  const [contratoDetalhe, setContratoDetalhe] = useState(null);

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/creditos/contratos');
      const lista = Array.isArray(data) ? data : data?.content || [];
      setContratos(lista);
    } catch (error) {
      setContratos([
        {
          id: 'CTR-001',
          tipoCredito: 'PESSOAL',
          valorContratado: 25000,
          taxaJuros: 3.49,
          prazoMeses: 36,
          parcelasPagas: 12,
          parcelasRestantes: 24,
          saldoDevedor: 17850.00,
          valorParcela: 879.50,
          dataInicio: '2024-01-15',
          proximoVencimento: '2025-02-15',
          status: 'ATIVO',
        },
        {
          id: 'CTR-002',
          tipoCredito: 'CONSIGNADO',
          valorContratado: 15000,
          taxaJuros: 1.99,
          prazoMeses: 24,
          parcelasPagas: 24,
          parcelasRestantes: 0,
          saldoDevedor: 0,
          valorParcela: 698.30,
          dataInicio: '2023-06-01',
          proximoVencimento: null,
          status: 'QUITADO',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVO': return 'primary';
      case 'QUITADO': return 'success';
      case 'ATRASADO': return 'error';
      case 'INADIMPLENTE': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ATIVO': return 'Ativo';
      case 'QUITADO': return 'Quitado';
      case 'ATRASADO': return 'Atrasado';
      case 'INADIMPLENTE': return 'Inadimplente';
      default: return status;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'CONSIGNADO': return 'Crédito Consignado';
      case 'PESSOAL': return 'Crédito Pessoal';
      case 'FINANCIAMENTO': return 'Financiamento';
      case 'FGTS': return 'Crédito FGTS';
      default: return tipo;
    }
  };

  const toggleExpandir = (id) => {
    setContratoExpandido(contratoExpandido === id ? null : id);
  };

  const abrirDetalhes = (contrato) => {
    setContratoDetalhe(contrato);
    setDetalheOpen(true);
  };

  const gerarParcelasSimuladas = (contrato) => {
    const parcelas = [];
    const amortizacao = contrato.valorContratado / contrato.prazoMeses;
    let saldoDevedor = contrato.valorContratado;

    for (let i = 1; i <= contrato.prazoMeses; i++) {
      const juros = saldoDevedor * (contrato.taxaJuros / 100);
      const parcela = amortizacao + juros;
      const paga = i <= contrato.parcelasPagas;
      saldoDevedor -= amortizacao;

      parcelas.push({
        numero: i,
        valor: parcela,
        juros,
        amortizacao,
        saldoDevedor: Math.abs(saldoDevedor),
        paga,
        dataVencimento: new Date(new Date(contrato.dataInicio).setMonth(new Date(contrato.dataInicio).getMonth() + i)),
      });
    }
    return parcelas;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  const contratosAtivos = contratos.filter((c) => c.status !== 'QUITADO');
  const contratosQuitados = contratos.filter((c) => c.status === 'QUITADO');

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Description sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Contratos de Crédito
                </Typography>
              </Box>

              {mensagem && (
                <Alert severity={mensagem.tipo} sx={{ mb: 2 }} onClose={() => setMensagem(null)}>
                  {mensagem.texto}
                </Alert>
              )}

              {contratos.length === 0 ? (
                <Box textAlign="center" sx={{ py: 6 }}>
                  <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Nenhum contrato encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Solicite crédito para criar seu primeiro contrato.
                  </Typography>
                </Box>
              ) : (
                <>
                  {contratosAtivos.length > 0 && (
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Contratos Ativos ({contratosAtivos.length})
                    </Typography>
                  )}

                  {contratosAtivos.map((contrato) => {
                    const expandido = contratoExpandido === contrato.id;
                    const percentualPago = contrato.prazoMeses > 0
                      ? (contrato.parcelasPagas / contrato.prazoMeses) * 100
                      : 0;

                    return (
                      <Card key={contrato.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => toggleExpandir(contrato.id)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {getTipoLabel(contrato.tipoCredito)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Contrato: {contrato.id}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={getStatusLabel(contrato.status)}
                                color={getStatusColor(contrato.status)}
                                size="small"
                              />
                              {expandido ? <ExpandLess /> : <ExpandMore />}
                            </Box>
                          </Box>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Valor Contratado</Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {formatCurrency(contrato.valorContratado)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Parcela</Typography>
                              <Typography variant="body1">{formatCurrency(contrato.valorParcela)}/mês</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Taxa</Typography>
                              <Typography variant="body1">{contrato.taxaJuros}% a.m.</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">Parcelas</Typography>
                              <Typography variant="body1">
                                {contrato.parcelasPagas}/{contrato.prazoMeses}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">Progresso</Typography>
                              <Typography variant="caption">{percentualPago.toFixed(0)}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentualPago}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: contrato.status === 'ATRASADO' ? 'error.main' : 'primary.main',
                                },
                              }}
                            />
                          </Box>

                          <Collapse in={expandido}>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Saldo Devedor</Typography>
                                <Typography variant="body1" color="error.main" fontWeight="bold">
                                  {formatCurrency(contrato.saldoDevedor)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Data Início</Typography>
                                <Typography variant="body1">{formatDate(contrato.dataInicio)}</Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Próximo Vencimento</Typography>
                                <Typography variant="body1">
                                  {contrato.proximoVencimento ? formatDate(contrato.proximoVencimento) : '-'}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Parcelas Restantes</Typography>
                                <Typography variant="body1">{contrato.parcelasRestantes} meses</Typography>
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Payments />}
                                onClick={() => abrirDetalhes(contrato)}
                              >
                                Ver Parcelas
                              </Button>
                              {contrato.status === 'ATIVO' && (
                                <Button variant="contained" size="small" startIcon={<CheckCircle />}>
                                  Quitar
                                </Button>
                              )}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {contratosQuitados.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Contratos Quitados ({contratosQuitados.length})
                      </Typography>
                      {contratosQuitados.map((contrato) => (
                        <Card key={contrato.id} variant="outlined" sx={{ mb: 2, opacity: 0.8 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {getTipoLabel(contrato.tipoCredito)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {contrato.id} | Contratado: {formatCurrency(contrato.valorContratado)} | Quitado em {formatDate(contrato.dataInicio)}
                                </Typography>
                              </Box>
                              <Chip
                                label="Quitado"
                                color="success"
                                icon={<CheckCircle />}
                                size="small"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={detalheOpen} onClose={() => setDetalheOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalhes do Contrato - {contratoDetalhe?.id}
        </DialogTitle>
        <DialogContent>
          {contratoDetalhe && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Valor Contratado</Typography>
                  <Typography variant="h6">{formatCurrency(contratoDetalhe.valorContratado)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Saldo Devedor</Typography>
                  <Typography variant="h6" color="error.main">{formatCurrency(contratoDetalhe.saldoDevedor)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Taxa de Juros</Typography>
                  <Typography variant="h6">{contratoDetalhe.taxaJuros}% a.m.</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6" gutterBottom>Histórico de Parcelas</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>#</strong></TableCell>
                      <TableCell align="right"><strong>Amortização</strong></TableCell>
                      <TableCell align="right"><strong>Juros</strong></TableCell>
                      <TableCell align="right"><strong>Parcela</strong></TableCell>
                      <TableCell align="right"><strong>Saldo</strong></TableCell>
                      <TableCell><strong>Situação</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gerarParcelasSimuladas(contratoDetalhe).map((p) => (
                      <TableRow
                        key={p.numero}
                        hover
                        sx={{ backgroundColor: p.paga ? '#f0fff0' : 'inherit' }}
                      >
                        <TableCell>{p.numero}</TableCell>
                        <TableCell align="right">{formatCurrency(p.amortizacao)}</TableCell>
                        <TableCell align="right">{formatCurrency(p.juros)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(p.valor)}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(p.saldoDevedor)}</TableCell>
                        <TableCell>
                          <Chip
                            label={p.paga ? 'Paga' : 'Pendente'}
                            color={p.paga ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalheOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Contratos;
