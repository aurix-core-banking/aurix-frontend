import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { QrCode, Send, CheckCircle } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import numeral from 'numeral';
import { apiService } from '../../services/apiService';

const tiposChave = [
  { value: 'CPF', label: 'CPF' },
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'TELEFONE', label: 'Telefone' },
  { value: 'CHAVE_ALEATORIA', label: 'Chave Aleatória' },
];

function NovoPix({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tipoChave: 'CPF',
    chave: '',
    valor: '',
    descricao: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [senhaDialog, setSenhaDialog] = useState(false);
  const [gerarQrCode, setGerarQrCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const getChavePlaceholder = () => {
    switch (formData.tipoChave) {
      case 'CPF': return '000.000.000-00';
      case 'EMAIL': return 'exemplo@email.com';
      case 'TELEFONE': return '(00) 00000-0000';
      case 'CHAVE_ALEATORIA': return 'Chave aleatória';
      default: return '';
    }
  };

  const validarFormulario = () => {
    if (!formData.chave.trim()) {
      setMensagem({ tipo: 'error', texto: 'Informe a chave Pix.' });
      return false;
    }
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      setMensagem({ tipo: 'error', texto: 'Informe um valor válido.' });
      return false;
    }
    return true;
  };

  const handleAvancar = () => {
    setMensagem(null);
    if (activeStep === 0 && !validarFormulario()) return;
    if (activeStep === 1) {
      setSenhaDialog(true);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleConfirmarEnvio = async () => {
    if (!formData.senha) {
      setMensagem({ tipo: 'error', texto: 'Informe sua senha.' });
      return;
    }
    setSenhaDialog(false);
    setLoading(true);
    setMensagem(null);

    try {
      const response = await apiService.enviarPix({
        chaveDestino: formData.chave,
        tipoChaveDestino: formData.tipoChave,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
        senha: formData.senha,
      });

      setResultado({
        codigoTransacao: response.codigoTransacao || response.id || 'PIX-' + Date.now(),
        protocolo: response.protocolo || 'PROT-' + Date.now(),
      });
      setActiveStep(2);
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao enviar PIX. Tente novamente.',
      });
    } finally {
      setLoading(false);
      setFormData((prev) => ({ ...prev, senha: '' }));
    }
  };

  const handleGerarQRCode = async () => {
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      setMensagem({ tipo: 'error', texto: 'Informe um valor para gerar o QR Code.' });
      return;
    }
    setLoading(true);
    setMensagem(null);
    try {
      const response = await apiService.receberPix({
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
      });
      setQrCodeData(response.qrCode || response.qrCodeBase64 || '');
      setGerarQrCode(true);
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao gerar QR Code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNovoPix = () => {
    setActiveStep(0);
    setFormData({ tipoChave: 'CPF', chave: '', valor: '', descricao: '', senha: '' });
    setResultado(null);
    setMensagem(null);
    setGerarQrCode(false);
    setQrCodeData('');
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  const steps = ['Dados do PIX', 'Confirmação', 'Concluído'];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Send sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Novo PIX
                </Typography>
              </Box>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {mensagem && (
                <Alert severity={mensagem.tipo} sx={{ mb: 2 }} onClose={() => setMensagem(null)}>
                  {mensagem.texto}
                </Alert>
              )}

              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Chave</InputLabel>
                      <Select
                        value={formData.tipoChave}
                        onChange={handleChange('tipoChave')}
                        label="Tipo de Chave"
                      >
                        {tiposChave.map((tc) => (
                          <MenuItem key={tc.value} value={tc.value}>
                            {tc.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Chave Pix"
                      value={formData.chave}
                      onChange={handleChange('chave')}
                      placeholder={getChavePlaceholder()}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor"
                      type="number"
                      value={formData.valor}
                      onChange={handleChange('valor')}
                      required
                      inputProps={{ min: 0.01, step: 0.01 }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={formData.descricao}
                      onChange={handleChange('descricao')}
                      placeholder="Ex: Pagamento jantar"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAvancar}
                      disabled={!formData.chave || !formData.valor || parseFloat(formData.valor) <= 0}
                      sx={{ mt: 1 }}
                    >
                      Continuar
                    </Button>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Resumo da Transferência</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Tipo de Chave</Typography>
                      <Typography variant="body1">{tiposChave.find((tc) => tc.value === formData.tipoChave)?.label}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Chave PIX</Typography>
                      <Typography variant="body1">{formData.chave}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Valor</Typography>
                      <Typography variant="h6" color="primary.main">{formatCurrency(formData.valor)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Descrição</Typography>
                      <Typography variant="body1">{formData.descricao || 'Sem descrição'}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleVoltar}>
                      Voltar
                    </Button>
                    <Button variant="contained" onClick={handleAvancar} disabled={loading}>
                      {loading ? 'Enviando...' : 'Confirmar com Senha'}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                <Box textAlign="center" sx={{ py: 3 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom color="success.main">
                    PIX Enviado com Sucesso!
                  </Typography>
                  {resultado && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Código da Transação: <strong>{resultado.codigoTransacao}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Protocolo: <strong>{resultado.protocolo}</strong>
                      </Typography>
                    </Box>
                  )}
                  <Button variant="contained" onClick={handleNovoPix} sx={{ mt: 3 }}>
                    Novo PIX
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QrCode sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">QR Code PIX</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gere um QR Code para receber um PIX.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Valor para receber"
                type="number"
                value={formData.valor}
                onChange={handleChange('valor')}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGerarQRCode}
                disabled={loading || !formData.valor || parseFloat(formData.valor) <= 0}
                startIcon={<QrCode />}
              >
                Gerar QR Code
              </Button>

              {gerarQrCode && (
                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  {qrCodeData ? (
                    <Box
                      component="img"
                      src={qrCodeData}
                      alt="QR Code PIX"
                      sx={{ maxWidth: 200, mb: 2 }}
                    />
                  ) : (
                    <QRCode
                      value={`00020126580014br.gov.bcb.pix0136${formData.chave || 'aurix'}5204000053039865404${parseFloat(formData.valor).toFixed(2)}5802BR5913Aurix Bank6009SAO PAULO62070503***6304`}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Valor: {formatCurrency(formData.valor)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={senhaDialog} onClose={() => setSenhaDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar com Senha</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Informe sua senha para confirmar o envio do PIX.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={handleChange('senha')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmarEnvio();
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSenhaDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmarEnvio} disabled={loading || !formData.senha}>
            {loading ? 'Enviando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NovoPix;
