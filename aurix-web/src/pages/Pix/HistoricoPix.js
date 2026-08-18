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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { History, Search, Info, FilterList } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import numeral from 'numeral';
import { apiService } from '../../services/apiService';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'CONCLUIDA', label: 'Concluída' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PROCESSANDO', label: 'Processando' },
  { value: 'ERRO', label: 'Erro' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

function HistoricoPix({ user }) {
  const [loading, setLoading] = useState(true);
  const [transacoes, setTransacoes] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [detalheOpen, setDetalheOpen] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/pix/transferencias', {
        params: {
          dataInicial: dataInicial || undefined,
          dataFinal: dataFinal || undefined,
          status: statusFiltro || undefined,
        },
      });
      const lista = Array.isArray(data) ? data : data?.content || [];
      setTransacoes(lista);
    } catch (error) {
      setTransacoes([]);
      setMensagem({ tipo: 'info', texto: 'Nenhum histórico encontrado.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = () => {
    carregarHistorico();
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONCLUIDA': return 'success';
      case 'PENDENTE': return 'warning';
      case 'PROCESSANDO': return 'info';
      case 'ERRO': return 'error';
      case 'CANCELADA': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const found = statusOptions.find((s) => s.value === status);
    return found?.label || status;
  };

  const abrirDetalhes = (transacao) => {
    setDetalhe(transacao);
    setDetalheOpen(true);
  };

  if (loading && transacoes.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <History sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Histórico PIX
                </Typography>
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Data Inicial"
                    type="date"
                    fullWidth
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Data Final"
                    type="date"
                    fullWidth
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      value={statusFiltro}
                      onChange={(e) => setStatusFiltro(e.target.value)}
                      label="Status"
                      startAdornment={<FilterList sx={{ mr: 0.5, fontSize: 18 }} />}
                    >
                      {statusOptions.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleFiltrar}
                    fullWidth
                  >
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {mensagem && (
          <Grid item xs={12}>
            <Alert severity={mensagem.tipo} onClose={() => setMensagem(null)}>
              {mensagem.texto}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transferências PIX ({transacoes.length})
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Data</strong></TableCell>
                      <TableCell><strong>Protocolo</strong></TableCell>
                      <TableCell><strong>Chave Destino</strong></TableCell>
                      <TableCell><strong>Descrição</strong></TableCell>
                      <TableCell align="right"><strong>Valor</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Detalhes</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Nenhuma transferência PIX encontrada.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transacoes.map((t) => (
                        <TableRow key={t.id} hover>
                          <TableCell>{formatDate(t.data)}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {t.protocolo || t.codigo || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>{t.chaveDestino || t.chave || '-'}</TableCell>
                          <TableCell>{t.descricao || '-'}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(t.valor)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(t.status)}
                              color={getStatusColor(t.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              onClick={() => abrirDetalhes(t)}
                              startIcon={<Info />}
                            >
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={detalheOpen} onClose={() => setDetalheOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Transferência PIX</DialogTitle>
        <DialogContent>
          {detalhe && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Protocolo</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {detalhe.protocolo || detalhe.codigo || '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">ID E2E</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {detalhe.e2eId || detalhe.endToEndId || detalhe.id || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Data/Hora</Typography>
                <Typography variant="body1">{formatDate(detalhe.data)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip
                  label={getStatusLabel(detalhe.status)}
                  color={getStatusColor(detalhe.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Tipo de Chave</Typography>
                <Typography variant="body1">{detalhe.tipoChave || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Chave Destino</Typography>
                <Typography variant="body1">{detalhe.chaveDestino || detalhe.chave || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Nome Destinatário</Typography>
                <Typography variant="body1">{detalhe.nomeDestino || detalhe.nomeBeneficiario || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Instituição Destino</Typography>
                <Typography variant="body1">{detalhe.instituicaoDestino || '-'}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Valor</Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(detalhe.valor)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Descrição</Typography>
                <Typography variant="body1">{detalhe.descricao || '-'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalheOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HistoricoPix;
