import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
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
  Alert,
  Divider,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Calculate, TrendingDown, Info } from '@mui/icons-material';
import numeral from 'numeral';
import { apiService } from '../../services/apiService';

const tiposCredito = [
  { value: 'CONSIGNADO', label: 'Crédito Consignado' },
  { value: 'PESSOAL', label: 'Crédito Pessoal' },
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'FGTS', label: 'Crédito FGTS' },
];

const prazosDisponiveis = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 180, 240, 300, 360];

function Simulador({ user }) {
  const [tipoCredito, setTipoCredito] = useState('PESSOAL');
  const [valorDesejado, setValorDesejado] = useState('');
  const [prazoMeses, setPrazoMeses] = useState(36);
  const [taxaJuros, setTaxaJuros] = useState('');
  const [tabAmortizacao, setTabAmortizacao] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const getTaxaDefault = (tipo) => {
    switch (tipo) {
      case 'CONSIGNADO': return '1.99';
      case 'PESSOAL': return '3.49';
      case 'FINANCIAMENTO': return '1.29';
      case 'FGTS': return '2.15';
      default: return '2.50';
    }
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setTipoCredito(tipo);
    setTaxaJuros(getTaxaDefault(tipo));
    setResultado(null);
  };

  const calcularSAC = (valor, taxa, prazo) => {
    const parcelas = [];
    const amortizacao = valor / prazo;
    let saldoDevedor = valor;
    let iofTotal = 0;

    for (let i = 1; i <= prazo; i++) {
      const juros = saldoDevedor * (taxa / 100);
      const parcela = amortizacao + juros;
      const iof = parcela * 0.0038;
      iofTotal += iof;
      saldoDevedor -= amortizacao;

      parcelas.push({
        numero: i,
        amortizacao: Math.abs(amortizacao),
        juros,
        iof,
        parcela: parcela + iof,
        saldoDevedor: Math.abs(saldoDevedor),
      });
    }

    return { parcelas, iofTotal, valorTotal: parcelas.reduce((s, p) => s + p.parcela, 0) };
  };

  const calcularPrice = (valor, taxa, prazo) => {
    const parcelas = [];
    const taxaDecimal = taxa / 100;
    const fator = Math.pow(1 + taxaDecimal, prazo);
    const parcelaFixa = valor * (taxaDecimal * fator) / (fator - 1);
    let saldoDevedor = valor;
    let iofTotal = 0;

    for (let i = 1; i <= prazo; i++) {
      const juros = saldoDevedor * taxaDecimal;
      const amortizacao = parcelaFixa - juros;
      const iof = parcelaFixa * 0.0038;
      iofTotal += iof;
      saldoDevedor -= amortizacao;

      parcelas.push({
        numero: i,
        amortizacao,
        juros,
        iof,
        parcela: parcelaFixa + iof,
        saldoDevedor: Math.abs(saldoDevedor),
      });
    }

    return { parcelas, iofTotal, valorTotal: parcelas.reduce((s, p) => s + p.parcela, 0) };
  };

  const handleSimular = async () => {
    setMensagem(null);
    if (!valorDesejado || parseFloat(valorDesejado) <= 0) {
      setMensagem({ tipo: 'error', texto: 'Informe um valor válido.' });
      return;
    }
    if (!taxaJuros || parseFloat(taxaJuros) <= 0) {
      setMensagem({ tipo: 'error', texto: 'Informe a taxa de juros.' });
      return;
    }

    setLoading(true);
    try {
      const valor = parseFloat(valorDesejado);
      const taxa = parseFloat(taxaJuros);

      const sac = calcularSAC(valor, taxa, prazoMeses);
      const price = calcularPrice(valor, taxa, prazoMeses);

      const iofTotal = valor * 0.0038 * prazoMeses;

      const cet = ((sac.valorTotal / valor - 1) / prazoMeses * 12) * 100;

      setResultado({
        sac,
        price,
        iofTotal,
        cet,
        valorPrincipal: valor,
        taxaAnual: taxa * 12,
      });
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao simular. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  const parcelasAtuais = resultado
    ? tabAmortizacao === 0 ? resultado.sac.parcelas : resultado.price.parcelas
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Calculate sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Simulador de Crédito
                </Typography>
              </Box>

              {mensagem && (
                <Alert severity={mensagem.tipo} sx={{ mb: 2 }} onClose={() => setMensagem(null)}>
                  {mensagem.texto}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Crédito</InputLabel>
                    <Select
                      value={tipoCredito}
                      onChange={handleTipoChange}
                      label="Tipo de Crédito"
                    >
                      {tiposCredito.map((tc) => (
                        <MenuItem key={tc.value} value={tc.value}>
                          {tc.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor Desejado"
                    type="number"
                    value={valorDesejado}
                    onChange={(e) => setValorDesejado(e.target.value)}
                    inputProps={{ min: 100, step: 100 }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Prazo (meses)</InputLabel>
                    <Select
                      value={prazoMeses}
                      onChange={(e) => setPrazoMeses(e.target.value)}
                      label="Prazo (meses)"
                    >
                      {prazosDisponiveis.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p} meses ({(p / 12).toFixed(1)} anos)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Taxa de Juros (% a.m.)"
                    type="number"
                    value={taxaJuros}
                    onChange={(e) => setTaxaJuros(e.target.value)}
                    inputProps={{ min: 0.01, step: 0.01 }}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1 }}>% a.m.</Typography>,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSimular}
                    disabled={loading}
                    size="large"
                    startIcon={<Calculate />}
                  >
                    {loading ? 'Simulando...' : 'Simular'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {resultado && (
            <>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Resumo da Simulação</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Valor Principal</Typography>
                      <Typography variant="h6">{formatCurrency(resultado.valorPrincipal)}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Taxa Mensal</Typography>
                      <Typography variant="h6">{taxaJuros}%</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Taxa Anual</Typography>
                      <Typography variant="h6">{resultado.taxaAnual.toFixed(1)}%</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">CET (ano)</Typography>
                      <Typography variant="h6" color="warning.main">{resultado.cet.toFixed(1)}%</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">IOF Total</Typography>
                      <Typography variant="body1">{formatCurrency(resultado.iofTotal)}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Prazo</Typography>
                      <Typography variant="body1">{prazoMeses} meses</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">1ª Parcela SAC</Typography>
                      <Typography variant="body1" color="primary.main" fontWeight="bold">
                        {formatCurrency(resultado.sac.parcelas[0]?.parcela || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Parcela Price</Typography>
                      <Typography variant="body1" color="primary.main" fontWeight="bold">
                        {formatCurrency(resultado.price.parcelas[0]?.parcela || 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Tabela de Parcelas</Typography>
                    <Chip
                      icon={<Info />}
                      label={`Total: ${formatCurrency(tabAmortizacao === 0 ? resultado.sac.valorTotal : resultado.price.valorTotal)}`}
                      color="primary"
                    />
                  </Box>

                  <Tabs
                    value={tabAmortizacao}
                    onChange={(_, v) => setTabAmortizacao(v)}
                    sx={{ mb: 2 }}
                  >
                    <Tab label="SAC (Sistema Amortização Constante)" />
                    <Tab label="Price (Parcelas Fixas)" />
                  </Tabs>

                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell><strong>Parcela</strong></TableCell>
                          <TableCell align="right"><strong>Amortização</strong></TableCell>
                          <TableCell align="right"><strong>Juros</strong></TableCell>
                          <TableCell align="right"><strong>IOF</strong></TableCell>
                          <TableCell align="right"><strong>Parcela</strong></TableCell>
                          <TableCell align="right"><strong>Saldo Devedor</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parcelasAtuais.map((p) => (
                          <TableRow key={p.numero} hover>
                            <TableCell>{p.numero}</TableCell>
                            <TableCell align="right">{formatCurrency(p.amortizacao)}</TableCell>
                            <TableCell align="right" sx={{ color: 'error.main' }}>
                              {formatCurrency(p.juros)}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(p.iof)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(p.parcela)}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(p.saldoDevedor)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </>
          )}

          {!resultado && (
            <Card>
              <CardContent>
                <Box textAlign="center" sx={{ py: 6 }}>
                  <TrendingDown sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Preencha o formulário e clique em "Simular"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compare parcelas SAC e Price, veja IOF e CET estimado.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Simulador;
