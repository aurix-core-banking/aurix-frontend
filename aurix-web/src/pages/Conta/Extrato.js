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
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import { Download, Search, FilterList } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import numeral from 'numeral';
import { apiService } from '../../services/apiService';

const tiposTransacao = [
  { value: '', label: 'Todas' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TED', label: 'TED' },
  { value: 'DOC', label: 'DOC' },
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'DEBITO', label: 'Débito' },
  { value: 'CREDITO', label: 'Crédito' },
];

function Extrato({ user }) {
  const [loading, setLoading] = useState(true);
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [valorMaximo, setValorMaximo] = useState('');
  const [transacoes, setTransacoes] = useState([]);
  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [saldoFinal, setSaldoFinal] = useState(0);
  const [exportando, setExportando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    const carregarContas = async () => {
      try {
        setLoading(true);
        const data = await apiService.getContas(user?.contaId || 1);
        const lista = Array.isArray(data) ? data : data?.content || [];
        setContas(lista);
        if (lista.length > 0) {
          setContaSelecionada(lista[0].id);
        }
      } catch (error) {
        setContas([
          { id: 1, numero: '12345-6', tipo: 'Corrente', saldo: 15750.50 },
          { id: 2, numero: '67890-1', tipo: 'Poupança', saldo: 25000 },
        ]);
        setContaSelecionada(1);
      } finally {
        setLoading(false);
      }
    };
    carregarContas();
  }, [user]);

  const formatCurrency = (value) => {
    return numeral(value).format('$0,0.00');
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const handleConsultar = async () => {
    if (!contaSelecionada) return;
    setLoading(true);
    setMensagem(null);
    try {
      const params = {};
      if (dataInicial) params.dataInicial = dataInicial;
      if (dataFinal) params.dataFinal = dataFinal;
      if (tipoFiltro) params.tipo = tipoFiltro;

      const data = await apiService.getTransacoes(contaSelecionada, params);
      let lista = Array.isArray(data) ? data : data?.content || [];

      if (valorMinimo) {
        lista = lista.filter((t) => Math.abs(t.valor) >= parseFloat(valorMinimo));
      }
      if (valorMaximo) {
        lista = lista.filter((t) => Math.abs(t.valor) <= parseFloat(valorMaximo));
      }

      setTransacoes(lista);

      if (lista.length > 0) {
        const saldoIni = lista[lista.length - 1].saldoAnterior || lista[lista.length - 1].saldo || 0;
        const saldoFim = lista[0].saldo || 0;
        setSaldoAnterior(saldoIni);
        setSaldoFinal(saldoFim);
      } else {
        setSaldoAnterior(0);
        setSaldoFinal(0);
        setMensagem({ tipo: 'info', texto: 'Nenhuma transação encontrada para os filtros selecionados.' });
      }
    } catch (error) {
      console.error('Erro ao consultar extrato:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao consultar extrato. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPDF = async () => {
    if (transacoes.length === 0) {
      setMensagem({ tipo: 'warning', texto: 'Consulte o extrato antes de exportar.' });
      return;
    }
    setExportando(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Extrato Bancario - Aurix', 20, 20);
      doc.setFontSize(10);
      doc.text(`Conta: ${contas.find((c) => c.id === contaSelecionada)?.numero || ''}`, 20, 30);
      doc.text(`Periodo: ${dataInicial || 'Inicio'} a ${dataFinal || 'Hoje'}`, 20, 36);

      let y = 50;
      doc.setFontSize(12);
      doc.text('Data', 20, y);
      doc.text('Descricao', 60, y);
      doc.text('Valor', 130, y);
      doc.text('Saldo', 170, y);
      y += 4;
      doc.line(20, y, 190, y);
      y += 8;

      doc.setFontSize(9);
      transacoes.forEach((t) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(formatDate(t.data), 20, y);
        doc.text((t.descricao || '').substring(0, 35), 60, y);
        doc.text(formatCurrency(Math.abs(t.valor)), 130, y);
        doc.text(formatCurrency(t.saldo), 170, y);
        y += 7;
      });

      y += 4;
      doc.line(20, y, 190, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`Saldo Anterior: ${formatCurrency(saldoAnterior)}`, 20, y);
      y += 6;
      doc.text(`Saldo Final: ${formatCurrency(saldoFinal)}`, 20, y);

      doc.save(`extrato-${contaSelecionada}-${format(new Date(), 'yyyyMMdd')}.pdf`);
      setMensagem({ tipo: 'success', texto: 'PDF exportado com sucesso!' });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao exportar PDF.' });
    } finally {
      setExportando(false);
    }
  };

  const getTipoChipColor = (tipo) => {
    switch (tipo) {
      case 'PIX': return 'primary';
      case 'TED': return 'secondary';
      case 'DOC': return 'info';
      case 'BOLETO': return 'warning';
      case 'CREDITO': return 'success';
      case 'DEBITO': return 'error';
      default: return 'default';
    }
  };

  if (loading && contas.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" height={120} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" height={300} />
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
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                  Extrato da Conta
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleExportarPDF}
                  disabled={exportando || transacoes.length === 0}
                >
                  {exportando ? 'Exportando...' : 'Exportar PDF'}
                </Button>
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="conta-label">Conta</InputLabel>
                    <Select
                      labelId="conta-label"
                      value={contaSelecionada}
                      onChange={(e) => setContaSelecionada(e.target.value)}
                      label="Conta"
                    >
                      {contas.map((conta) => (
                        <MenuItem key={conta.id} value={conta.id}>
                          {conta.tipo} - {conta.numero} ({formatCurrency(conta.saldo)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Data Inicial"
                    type="date"
                    fullWidth
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Data Final"
                    type="date"
                    fullWidth
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="tipo-label">Tipo</InputLabel>
                    <Select
                      labelId="tipo-label"
                      value={tipoFiltro}
                      onChange={(e) => setTipoFiltro(e.target.value)}
                      label="Tipo"
                      startAdornment={<FilterList sx={{ mr: 0.5, fontSize: 18 }} />}
                    >
                      {tiposTransacao.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField
                    label="Valor Mín."
                    type="number"
                    fullWidth
                    value={valorMinimo}
                    onChange={(e) => setValorMinimo(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <TextField
                    label="Valor Máx."
                    type="number"
                    fullWidth
                    value={valorMaximo}
                    onChange={(e) => setValorMaximo(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleConsultar}
                    fullWidth
                  >
                    Buscar
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Transações ({transacoes.length})
                </Typography>
                {transacoes.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Typography variant="body2">
                      <strong>Saldo Anterior:</strong>{' '}
                      <span style={{ color: saldoAnterior >= 0 ? '#2e7d32' : '#d32f2f' }}>
                        {formatCurrency(saldoAnterior)}
                      </span>
                    </Typography>
                    <Typography variant="body2">
                      <strong>Saldo Final:</strong>{' '}
                      <span style={{ color: saldoFinal >= 0 ? '#2e7d32' : '#d32f2f' }}>
                        {formatCurrency(saldoFinal)}
                      </span>
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Data</strong></TableCell>
                      <TableCell><strong>Descrição</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell align="right"><strong>Valor</strong></TableCell>
                      <TableCell align="right"><strong>Saldo</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Nenhuma transação encontrada. Ajuste os filtros e clique em "Buscar".
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transacoes.map((transacao) => (
                        <TableRow key={transacao.id} hover>
                          <TableCell>{formatDate(transacao.data)}</TableCell>
                          <TableCell>{transacao.descricao}</TableCell>
                          <TableCell>
                            <Chip
                              label={transacao.tipo}
                              color={getTipoChipColor(transacao.tipo)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: transacao.valor >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold',
                            }}
                          >
                            {transacao.valor >= 0 ? '+' : '-'}{formatCurrency(Math.abs(transacao.valor))}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(transacao.saldo)}
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
    </Box>
  );
}

export default Extrato;
