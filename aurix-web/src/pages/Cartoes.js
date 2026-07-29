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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CreditCard,
  Add,
  Payment,
  Receipt,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Cartoes({ user }) {
  const [cartoes, setCartoes] = useState([]);
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [emitirOpen, setEmitirOpen] = useState(false);
  const [pagarOpen, setPagarOpen] = useState(false);
  const [novoCartao, setNovoCartao] = useState({
    tipoCartao: 'CREDITO',
    bandeira: 'VISA',
    limiteCredito: '',
  });
  const [faturaSelecionada, setFaturaSelecionada] = useState(null);
  const [valorPagamento, setValorPagamento] = useState('');

  useEffect(() => {
    carregarCartoes();
  }, []);

  const carregarCartoes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCartoes(user?.contaId || 1);
      setCartoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarFaturas = async (cartaoId) => {
    try {
      const data = await apiService.getFaturas(cartaoId);
      setFaturas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    }
  };

  const handleEmitirCartao = async () => {
    try {
      await apiService.emitirCartao({
        contaId: user?.contaId || 1,
        ...novoCartao,
        limiteCredito: parseFloat(novoCartao.limiteCredito),
        nomePortador: user?.nome || 'Cliente',
      });
      setEmitirOpen(false);
      carregarCartoes();
    } catch (error) {
      console.error('Erro ao emitir cartão:', error);
    }
  };

  const handlePagarFatura = async () => {
    try {
      await apiService.pagarFatura(faturaSelecionada.id, parseFloat(valorPagamento));
      setPagarOpen(false);
      setFaturaSelecionada(null);
      setValorPagamento('');
      carregarFaturas(faturaSelecionada.cartaoId);
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
    }
  };

  const mascararNumero = (numero) => {
    if (!numero) return '';
    return '**** **** **** ' + numero.slice(-4);
  };

  const getStatusColor = (status) => {
    const colors = {
      ATIVO: 'success',
      BLOQUEADO: 'error',
      CANCELADO: 'default',
      PENDENTE_ATIVACAO: 'warning',
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Cartões</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setEmitirOpen(true)}
        >
          Solicitar Cartão
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab icon={<CreditCard />} label="Meus Cartões" />
            <Tab icon={<Receipt />} label="Faturas" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              {loading ? (
                <Typography>Carregando...</Typography>
              ) : cartoes.length === 0 ? (
                <Typography>Nenhum cartão encontrado</Typography>
              ) : (
                <Grid container spacing={2}>
                  {cartoes.map((cartao) => (
                    <Grid item xs={12} md={6} key={cartao.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">{cartao.bandeira}</Typography>
                            <Chip
                              label={cartao.status}
                              color={getStatusColor(cartao.status)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="h5" gutterBottom>
                            {mascararNumero(cartao.numeroCartao)}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {cartao.nomePortador}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Válido até: {format(new Date(cartao.dataValidade), 'MM/yy')}
                          </Typography>
                          {cartao.tipoCartao === 'CREDITO' && (
                            <Box mt={2}>
                              <Typography variant="body2" color="text.secondary">
                                Limite: {numeral(cartao.limiteCredito).format('$0,0.00')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Disponível:{' '}
                                {numeral(cartao.limiteDisponivel).format('$0,0.00')}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 3 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cartão</TableCell>
                      <TableCell>Mês/Ano</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Valor Pago</TableCell>
                      <TableCell>Valor Pendente</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {faturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Nenhuma fatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      faturas.map((fatura) => (
                        <TableRow key={fatura.id}>
                          <TableCell>{fatura.codigoFatura}</TableCell>
                          <TableCell>
                            {fatura.mesReferencia}/{fatura.anoReferencia}
                          </TableCell>
                          <TableCell>
                            {numeral(fatura.valorTotal).format('$0,0.00')}
                          </TableCell>
                          <TableCell>
                            {numeral(fatura.valorPago).format('$0,0.00')}
                          </TableCell>
                          <TableCell>
                            {numeral(fatura.valorPendente).format('$0,0.00')}
                          </TableCell>
                          <TableCell>
                            {format(new Date(fatura.dataVencimento), 'dd/MM/yyyy', {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={fatura.status}
                              color={
                                fatura.status === 'PAGA'
                                  ? 'success'
                                  : fatura.status === 'VENCIDA'
                                  ? 'error'
                                  : 'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {fatura.status !== 'PAGA' && (
                              <Button
                                size="small"
                                onClick={() => {
                                  setFaturaSelecionada(fatura);
                                  setValorPagamento(fatura.valorPendente.toString());
                                  setPagarOpen(true);
                                }}
                              >
                                Pagar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={emitirOpen} onClose={() => setEmitirOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Solicitar Novo Cartão</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={novoCartao.tipoCartao}
                  onChange={(e) =>
                    setNovoCartao({ ...novoCartao, tipoCartao: e.target.value })
                  }
                >
                  <MenuItem value="CREDITO">Crédito</MenuItem>
                  <MenuItem value="DEBITO">Débito</MenuItem>
                  <MenuItem value="CREDITO_DEBITO">Crédito e Débito</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Bandeira</InputLabel>
                <Select
                  value={novoCartao.bandeira}
                  onChange={(e) =>
                    setNovoCartao({ ...novoCartao, bandeira: e.target.value })
                  }
                >
                  <MenuItem value="VISA">Visa</MenuItem>
                  <MenuItem value="MASTERCARD">Mastercard</MenuItem>
                  <MenuItem value="ELO">Elo</MenuItem>
                  <MenuItem value="AMEX">American Express</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Limite de Crédito"
                type="number"
                value={novoCartao.limiteCredito}
                onChange={(e) =>
                  setNovoCartao({ ...novoCartao, limiteCredito: e.target.value })
                }
                disabled={novoCartao.tipoCartao === 'DEBITO'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmitirOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleEmitirCartao}
            disabled={
              !novoCartao.bandeira ||
              (novoCartao.tipoCartao !== 'DEBITO' && !novoCartao.limiteCredito)
            }
          >
            Solicitar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pagarOpen} onClose={() => setPagarOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pagar Fatura</DialogTitle>
        <DialogContent>
          {faturaSelecionada && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Fatura: {faturaSelecionada.codigoFatura}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Valor Total: {numeral(faturaSelecionada.valorTotal).format('$0,0.00')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Valor Pendente:{' '}
                {numeral(faturaSelecionada.valorPendente).format('$0,0.00')}
              </Typography>
              <TextField
                fullWidth
                label="Valor do Pagamento"
                type="number"
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPagarOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handlePagarFatura}
            disabled={!valorPagamento}
          >
            Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cartoes;
