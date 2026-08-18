import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Payment, CheckCircle, Search } from '@mui/icons-material';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/apiService';

function PagarBoleto({ user }) {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [linhaDigitavel, setLinhaDigitavel] = useState('');
  const [tipoInput, setTipoInput] = useState('codigoBarras');
  const [boletoInfo, setBoletoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [senha, setSenha] = useState('');
  const [pagamentoRealizado, setPagamentoRealizado] = useState(false);

  const handleConsultar = async () => {
    const valorInput = tipoInput === 'codigoBarras' ? codigoBarras : linhaDigitavel;
    if (!valorInput.trim()) {
      setMensagem({ tipo: 'error', texto: 'Informe o código de barras ou linha digitável.' });
      return;
    }

    setLoading(true);
    setMensagem(null);
    setBoletoInfo(null);

    try {
      const data = await apiService.get('/boletos/consultar', {
        params: {
          codigoBarras: tipoInput === 'codigoBarras' ? valorInput : undefined,
          linhaDigitavel: tipoInput === 'linhaDigitavel' ? valorInput : undefined,
        },
      });
      setBoletoInfo(data);
    } catch (error) {
      setBoletoInfo(null);
      setMensagem({ tipo: 'error', texto: 'Boleto não encontrado. Verifique o código informado.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = () => {
    setConfirmDialog(true);
  };

  const handleConfirmarPagamento = async () => {
    if (!senha) {
      setMensagem({ tipo: 'error', texto: 'Informe sua senha.' });
      return;
    }
    setConfirmDialog(false);
    setLoading(true);
    setMensagem(null);

    try {
      await apiService.post('/boletos/pagar', {
        codigoBarras: boletoInfo.codigoBarras || codigoBarras,
        linhaDigitavel: boletoInfo.linhaDigitavel || linhaDigitavel,
        valor: boletoInfo.valorTotal,
        senha,
      });
      setPagamentoRealizado(true);
      setMensagem(null);
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao pagar boleto. Tente novamente.',
      });
    } finally {
      setLoading(false);
      setSenha('');
    }
  };

  const handleNovaConsulta = () => {
    setCodigoBarras('');
    setLinhaDigitavel('');
    setBoletoInfo(null);
    setMensagem(null);
    setPagamentoRealizado(false);
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (pagamentoRealizado) {
    return (
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Box textAlign="center" sx={{ py: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="success.main">
                Pagamento Realizado com Sucesso!
              </Typography>
              {boletoInfo && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    Beneficiário: <strong>{boletoInfo.beneficiario || boletoInfo.descricao}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valor Pago: <strong>{formatCurrency(boletoInfo.valorTotal)}</strong>
                  </Typography>
                </Box>
              )}
              <Button variant="contained" onClick={handleNovaConsulta} sx={{ mt: 3 }}>
                Pagar Outro Boleto
              </Button>
            </Box>
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
                <Payment sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Pagar Boleto
                </Typography>
              </Box>

              {mensagem && (
                <Alert severity={mensagem.tipo} sx={{ mb: 2 }} onClose={() => setMensagem(null)}>
                  {mensagem.texto}
                </Alert>
              )}

              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant={tipoInput === 'codigoBarras' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setTipoInput('codigoBarras')}
                    >
                      Código de Barras
                    </Button>
                    <Button
                      variant={tipoInput === 'linhaDigitavel' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setTipoInput('linhaDigitavel')}
                    >
                      Linha Digitável
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    label={tipoInput === 'codigoBarras' ? 'Código de Barras' : 'Linha Digitável'}
                    value={tipoInput === 'codigoBarras' ? codigoBarras : linhaDigitavel}
                    onChange={(e) => {
                      if (tipoInput === 'codigoBarras') setCodigoBarras(e.target.value);
                      else setLinhaDigitavel(e.target.value);
                    }}
                    placeholder={
                      tipoInput === 'codigoBarras'
                        ? '23793.38128 60000.000003 00000.000400 1 84370000012345'
                        : '23793381286000000000300000000400184370000012345'
                    }
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleConsultar}
                    disabled={loading || (!(tipoInput === 'codigoBarras' ? codigoBarras : linhaDigitavel).trim())}
                    startIcon={<Search />}
                  >
                    {loading ? 'Consultando...' : 'Consultar'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {boletoInfo && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Informações do Boleto</Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Beneficiário</Typography>
                    <Typography variant="body1">{boletoInfo.beneficiario || boletoInfo.descricao || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">CPF/CNPJ</Typography>
                    <Typography variant="body1">{boletoInfo.cpfCnpj || boletoInfo.documentoBeneficiario || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Vencimento</Typography>
                    <Typography variant="body1">{formatDate(boletoInfo.vencimento)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={boletoInfo.status || 'PENDENTE'}
                      color={boletoInfo.status === 'VENCIDO' ? 'error' : boletoInfo.status === 'PAGO' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Valor Original</Typography>
                    <Typography variant="body1">{formatCurrency(boletoInfo.valor)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Multa</Typography>
                    <Typography variant="body1" color="error.main">
                      {formatCurrency(boletoInfo.multa || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Juros</Typography>
                    <Typography variant="body1" color="error.main">
                      {formatCurrency(boletoInfo.juros || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(boletoInfo.valorTotal || boletoInfo.valor + (boletoInfo.multa || 0) + (boletoInfo.juros || 0))}
                    </Typography>
                  </Grid>
                </Grid>

                {boletoInfo.status !== 'PAGO' && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePagar}
                      disabled={loading}
                      startIcon={<Payment />}
                    >
                      Pagar Boleto
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Pagamento</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Deseja pagar o boleto no valor de{' '}
            <strong>{boletoInfo && formatCurrency(boletoInfo.valorTotal || boletoInfo.valor)}</strong>?
          </Typography>
          {boletoInfo && (
            <Typography variant="body2" color="text.secondary">
              Beneficiário: {boletoInfo.beneficiario || boletoInfo.descricao}
            </Typography>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmarPagamento();
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmarPagamento} disabled={loading || !senha}>
            {loading ? 'Pagando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PagarBoleto;
