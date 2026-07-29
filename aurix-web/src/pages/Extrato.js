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
  Skeleton
} from '@mui/material';
import {
  Download,
  Search
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import numeral from 'numeral';
import { apiService } from '../services/apiService';

function Extrato({ user }) {
  const [loading, setLoading] = useState(true);
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const carregarContas = async () => {
      try {
        setLoading(true);
        const data = await apiService.getContas(user?.contaId || 1);
        setContas(Array.isArray(data) ? data : []);
      } catch (error) {
        setContas([
          { id: 1, numero: '12345-6', tipo: 'Corrente', saldo: 15750.50 },
          { id: 2, numero: '67890-1', tipo: 'Poupança', saldo: 25000 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    carregarContas();
  }, []);

  const formatCurrency = (value) => {
    return numeral(value).format('$0,0.00');
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleConsultar = () => {
    const mockTransacoes = [
      { id: 1, data: '2024-12-15', descricao: 'PIX recebido - João Silva', valor: 500.00, saldo: 15750.50 },
      { id: 2, data: '2024-12-14', descricao: 'PIX enviado - Maria Santos', valor: -250.00, saldo: 15250.50 },
      { id: 3, data: '2024-12-13', descricao: 'PIX recebido - Freelance', valor: 1200.00, saldo: 15500.50 },
      { id: 4, data: '2024-12-12', descricao: 'Pagamento de boleto', valor: -850.00, saldo: 14300.50 },
      { id: 5, data: '2024-12-11', descricao: 'Transferência recebida', valor: 3000.00, saldo: 15150.50 },
    ];
    setTransacoes(mockTransacoes);
  };

  const handleDownloadPDF = () => {
    alert('Download do extrato em PDF iniciado.');
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
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                  Extrato Bancário
                </Typography>
                <Button variant="contained" startIcon={<Download />} onClick={handleDownloadPDF}>
                  Download PDF
                </Button>
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="conta-label">Conta</InputLabel>
                    <Select
                      labelId="conta-label"
                      value={contaSelecionada}
                      onChange={(e) => setContaSelecionada(e.target.value)}
                      label="Conta"
                    >
                      <MenuItem value="">
                        <em>Selecione uma conta</em>
                      </MenuItem>
                      {contas.map((conta) => (
                        <MenuItem key={conta.id} value={conta.id}>
                          {conta.tipo} - {conta.numero} ({formatCurrency(conta.saldo)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleConsultar}
                    fullWidth
                  >
                    Consultar
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transações
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Selecione uma conta e clique em "Consultar" para visualizar o extrato.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transacoes.map((transacao) => (
                        <TableRow key={transacao.id} hover>
                          <TableCell>{formatDate(transacao.data)}</TableCell>
                          <TableCell>{transacao.descricao}</TableCell>
                          <TableCell sx={{ color: transacao.valor >= 0 ? 'success.main' : 'error.main' }}>
                            {formatCurrency(Math.abs(transacao.valor))}
                          </TableCell>
                          <TableCell>{formatCurrency(transacao.saldo)}</TableCell>
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
