import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  TrendingUp,
  Add,
  Calculate,
  AccountBalance,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Investimentos({ user }) {
  const [investimentos, setInvestimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulacaoOpen, setSimulacaoOpen] = useState(false);
  const [aplicacaoOpen, setAplicacaoOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [simulacao, setSimulacao] = useState({
    tipo: 'CDB',
    valor: '',
    taxa: '',
    dias: '',
  });
  const [resultadoSimulacao, setResultadoSimulacao] = useState(null);
  const [novoInvestimento, setNovoInvestimento] = useState({
    tipoInvestimento: 'CDB',
    valorInvestido: '',
    taxaRendimento: '',
    dataVencimento: null,
  });

  useEffect(() => {
    carregarInvestimentos();
  }, []);

  const carregarInvestimentos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getInvestimentos(user?.contaId || 1);
      setInvestimentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimular = async () => {
    try {
      const resultado = await apiService.simularInvestimento(
        simulacao.tipo,
        parseFloat(simulacao.valor),
        parseFloat(simulacao.taxa) / 100,
        parseInt(simulacao.dias)
      );
      setResultadoSimulacao(resultado);
      setActiveStep(1);
    } catch (error) {
      console.error('Erro ao simular:', error);
    }
  };

  const handleAplicar = async () => {
    try {
      await apiService.criarInvestimento({
        contaId: user?.contaId || 1,
        ...novoInvestimento,
        valorInvestido: parseFloat(novoInvestimento.valorInvestido),
        taxaRendimento: parseFloat(novoInvestimento.taxaRendimento) / 100,
      });
      setAplicacaoOpen(false);
      carregarInvestimentos();
    } catch (error) {
      console.error('Erro ao aplicar:', error);
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      CDB: 'CDB',
      LCA: 'LCA',
      LCI: 'LCI',
      TESOURO_SELIC: 'Tesouro Selic',
      TESOURO_IPCA: 'Tesouro IPCA+',
      TESOURO_PREFIXADO: 'Tesouro Prefixado',
    };
    return tipos[tipo] || tipo;
  };

  const getStatusColor = (status) => {
    return status === 'ATIVO' ? 'success' : 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Investimentos</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Calculate />}
            onClick={() => setSimulacaoOpen(true)}
            sx={{ mr: 1 }}
          >
            Simular
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAplicacaoOpen(true)}
          >
            Novo Investimento
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Investido
              </Typography>
              <Typography variant="h4">
                {numeral(
                  investimentos.reduce(
                    (sum, inv) => sum + (inv.valorInvestido || 0),
                    0
                  )
                ).format('$0,0.00')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Rendimento Total
              </Typography>
              <Typography variant="h4" color="success.main">
                {numeral(
                  investimentos.reduce(
                    (sum, inv) => sum + (inv.rendimentoAtual || 0),
                    0
                  )
                ).format('$0,0.00')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Investimentos Ativos
              </Typography>
              <Typography variant="h4">
                {investimentos.filter((inv) => inv.status === 'ATIVO').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Meus Investimentos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Valor Investido</TableCell>
                  <TableCell>Taxa</TableCell>
                  <TableCell>Rendimento</TableCell>
                  <TableCell>Valor Total</TableCell>
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
                ) : investimentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum investimento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  investimentos.map((investimento) => (
                    <TableRow key={investimento.id}>
                      <TableCell>
                        {getTipoLabel(investimento.tipoInvestimento)}
                      </TableCell>
                      <TableCell>
                        {numeral(investimento.valorInvestido).format('$0,0.00')}
                      </TableCell>
                      <TableCell>
                        {(investimento.taxaRendimento * 100).toFixed(2)}% a.a.
                      </TableCell>
                      <TableCell color="success.main">
                        {numeral(investimento.rendimentoAtual || 0).format('$0,0.00')}
                      </TableCell>
                      <TableCell>
                        {numeral(
                          (investimento.valorInvestido || 0) +
                            (investimento.rendimentoAtual || 0)
                        ).format('$0,0.00')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={investimento.status}
                          color={getStatusColor(investimento.status)}
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

      <Dialog open={simulacaoOpen} onClose={() => setSimulacaoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Simular Investimento</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Dados</StepLabel>
            </Step>
            <Step>
              <StepLabel>Resultado</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={simulacao.tipo}
                    onChange={(e) =>
                      setSimulacao({ ...simulacao, tipo: e.target.value })
                    }
                  >
                    <MenuItem value="CDB">CDB</MenuItem>
                    <MenuItem value="LCA">LCA</MenuItem>
                    <MenuItem value="LCI">LCI</MenuItem>
                    <MenuItem value="TESOURO_SELIC">Tesouro Selic</MenuItem>
                    <MenuItem value="TESOURO_IPCA">Tesouro IPCA+</MenuItem>
                    <MenuItem value="TESOURO_PREFIXADO">Tesouro Prefixado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor"
                  type="number"
                  value={simulacao.valor}
                  onChange={(e) =>
                    setSimulacao({ ...simulacao, valor: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Taxa % a.a."
                  type="number"
                  value={simulacao.taxa}
                  onChange={(e) =>
                    setSimulacao({ ...simulacao, taxa: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Dias"
                  type="number"
                  value={simulacao.dias}
                  onChange={(e) =>
                    setSimulacao({ ...simulacao, dias: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && resultadoSimulacao && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resultado da Simulação
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Valor Investido</Typography>
                  <Typography variant="h6">
                    {numeral(resultadoSimulacao.valorInvestido).format('$0,0.00')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Rendimento Bruto</Typography>
                  <Typography variant="h6" color="success.main">
                    {numeral(resultadoSimulacao.rendimentoAtual).format('$0,0.00')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">IOF</Typography>
                  <Typography variant="h6" color="error.main">
                    {numeral(resultadoSimulacao.valorIOF || 0).format('$0,0.00')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">IR</Typography>
                  <Typography variant="h6" color="error.main">
                    {numeral(resultadoSimulacao.valorIR || 0).format('$0,0.00')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Valor Líquido</Typography>
                  <Typography variant="h5" color="primary.main">
                    {numeral(resultadoSimulacao.valorLiquido).format('$0,0.00')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep === 0 ? (
            <>
              <Button onClick={() => setSimulacaoOpen(false)}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={handleSimular}
                disabled={!simulacao.valor || !simulacao.taxa || !simulacao.dias}
              >
                Simular
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setActiveStep(0)}>Voltar</Button>
              <Button variant="contained" onClick={() => setSimulacaoOpen(false)}>
                Fechar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={aplicacaoOpen} onClose={() => setAplicacaoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Investimento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={novoInvestimento.tipoInvestimento}
                  onChange={(e) =>
                    setNovoInvestimento({
                      ...novoInvestimento,
                      tipoInvestimento: e.target.value,
                    })
                  }
                >
                  <MenuItem value="CDB">CDB</MenuItem>
                  <MenuItem value="LCA">LCA</MenuItem>
                  <MenuItem value="LCI">LCI</MenuItem>
                  <MenuItem value="TESOURO_SELIC">Tesouro Selic</MenuItem>
                  <MenuItem value="TESOURO_IPCA">Tesouro IPCA+</MenuItem>
                  <MenuItem value="TESOURO_PREFIXADO">Tesouro Prefixado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={novoInvestimento.valorInvestido}
                onChange={(e) =>
                  setNovoInvestimento({
                    ...novoInvestimento,
                    valorInvestido: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxa % a.a."
                type="number"
                value={novoInvestimento.taxaRendimento}
                onChange={(e) =>
                  setNovoInvestimento({
                    ...novoInvestimento,
                    taxaRendimento: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAplicacaoOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAplicar}
            disabled={
              !novoInvestimento.valorInvestido || !novoInvestimento.taxaRendimento
            }
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Investimentos;
