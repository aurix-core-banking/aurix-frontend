import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
} from '@mui/material';
import {
  QrCode,
  AccountBalance,
  Send,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import numeral from 'numeral';

function PIX({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [pixData, setPixData] = useState({
    chave: '',
    valor: '',
    descricao: '',
    tipoChave: 'CPF',
  });
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStep(0);
    setMessage({ type: '', text: '' });
  };

  const handleEnviarPix = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await apiService.enviarPix({
        chaveDestino: pixData.chave,
        valor: parseFloat(pixData.valor),
        descricao: pixData.descricao,
        tipoChave: pixData.tipoChave,
      });

      setMessage({
        type: 'success',
        text: `PIX enviado com sucesso! Código: ${response.codigoTransacao}`,
      });
      setPixData({ chave: '', valor: '', descricao: '', tipoChave: 'CPF' });
      setActiveStep(0);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao enviar PIX',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGerarQRCode = async () => {
    try {
      setLoading(true);
      const response = await apiService.receberPix({
        valor: parseFloat(pixData.valor),
        descricao: pixData.descricao,
      });
      setQrCode(response.qrCode);
      setActiveStep(1);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao gerar QR Code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        PIX
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Send />} label="Enviar PIX" />
            <Tab icon={<QrCode />} label="Receber PIX" />
            <Tab icon={<AccountBalance />} label="Chaves PIX" />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {tabValue === 0 && (
            <Box>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                <Step>
                  <StepLabel>Dados do PIX</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Confirmação</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Concluído</StepLabel>
                </Step>
              </Stepper>

              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Tipo de Chave"
                      value={pixData.tipoChave}
                      onChange={(e) =>
                        setPixData({ ...pixData, tipoChave: e.target.value })
                      }
                    >
                      <option value="CPF">CPF</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="TELEFONE">Telefone</option>
                      <option value="CHAVE_ALEATORIA">Chave Aleatória</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Chave PIX"
                      value={pixData.chave}
                      onChange={(e) =>
                        setPixData({ ...pixData, chave: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor"
                      type="number"
                      value={pixData.valor}
                      onChange={(e) =>
                        setPixData({ ...pixData, valor: e.target.value })
                      }
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={pixData.descricao}
                      onChange={(e) =>
                        setPixData({ ...pixData, descricao: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleEnviarPix}
                      disabled={loading || !pixData.chave || !pixData.valor}
                    >
                      Enviar PIX
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                <Step>
                  <StepLabel>Valor e Descrição</StepLabel>
                </Step>
                <Step>
                  <StepLabel>QR Code Gerado</StepLabel>
                </Step>
              </Stepper>

              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor"
                      type="number"
                      value={pixData.valor}
                      onChange={(e) =>
                        setPixData({ ...pixData, valor: e.target.value })
                      }
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={pixData.descricao}
                      onChange={(e) =>
                        setPixData({ ...pixData, descricao: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleGerarQRCode}
                      disabled={loading || !pixData.valor}
                    >
                      Gerar QR Code
                    </Button>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && qrCode && (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    QR Code para Recebimento
                  </Typography>
                  <Box
                    component="img"
                    src={qrCode}
                    alt="QR Code PIX"
                    sx={{ maxWidth: 300, mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Valor: {numeral(pixData.valor).format('$0,0.00')}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Minhas Chaves PIX
              </Typography>
              <Button variant="outlined" onClick={async () => {
                try {
                  const chaves = await apiService.get('/pix/chaves');
                  setMessage({ type: 'success', text: `${chaves.length} chaves cadastradas` });
                } catch (e) {
                  setMessage({ type: 'error', text: 'Erro ao carregar chaves' });
                }
              }}>Carregar Chaves</Button>
            </Box>
          )}

          {message.text && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default PIX;
