import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search, Download, FilterList } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../services/apiService';
import numeral from 'numeral';

function Transacoes({ user }) {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    contaId: '',
    tipo: '',
    status: '',
    dataInicio: null,
    dataFim: null,
  });

  useEffect(() => {
    carregarTransacoes();
  }, [filtros]);

  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTransacoes(filtros.contaId, {
        tipo: filtros.tipo,
        status: filtros.status,
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
      });
      setTransacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PROCESSADA: 'success',
      PENDENTE: 'warning',
      CANCELADA: 'error',
      FALHADA: 'error',
      REVERTIDA: 'info',
    };
    return colors[status] || 'default';
  };

  const formatarValor = (valor) => {
    return numeral(valor).format('$0,0.00');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transações
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Conta"
                select
                value={filtros.contaId}
                onChange={(e) => setFiltros({ ...filtros, contaId: e.target.value })}
              >
                <MenuItem value="">Todas</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="PIX">PIX</MenuItem>
                  <MenuItem value="TED">TED</MenuItem>
                  <MenuItem value="DOC">DOC</MenuItem>
                  <MenuItem value="TRANSFERENCIA_INTERNA">Transferência Interna</MenuItem>
                  <MenuItem value="PAGAMENTO_BOLETO">Pagamento de Boleto</MenuItem>
                  <MenuItem value="PAGAMENTO_CARTAO">Pagamento de Cartão</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="PROCESSADA">Processada</MenuItem>
                  <MenuItem value="CANCELADA">Cancelada</MenuItem>
                  <MenuItem value="FALHADA">Falhada</MenuItem>
                  <MenuItem value="REVERTIDA">Revertida</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Data Início"
                value={filtros.dataInicio}
                onChange={(date) => setFiltros({ ...filtros, dataInicio: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Data Fim"
                value={filtros.dataFim}
                onChange={(date) => setFiltros({ ...filtros, dataFim: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={carregarTransacoes}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Histórico de Transações</Typography>
            <Button startIcon={<Download />} variant="outlined">
              Exportar
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data/Hora</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : transacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell>
                        {format(new Date(transacao.dataTransacao), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>{transacao.codigoTransacao}</TableCell>
                      <TableCell>{transacao.tipoTransacao}</TableCell>
                      <TableCell>{transacao.descricao || '-'}</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={transacao.valor >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatarValor(transacao.valor)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transacao.status}
                          color={getStatusColor(transacao.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Transacoes;
