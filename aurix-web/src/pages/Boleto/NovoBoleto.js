import React, { useState } from 'react';
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
  Divider,
} from '@mui/material';
import { Receipt, CheckCircle } from '@mui/icons-material';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../../services/apiService';

const steps = ['Dados do Boleto', 'Revisão', 'Gerado'];

function NovoBoleto({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    beneficiario: '',
    cpfCnpj: '',
    valor: '',
    vencimento: '',
    descricao: '',
    instrucoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validarFormulario = () => {
    if (!formData.beneficiario.trim()) {
      setMensagem({ tipo: 'error', texto: 'Informe o nome do beneficiário.' });
      return false;
    }
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      setMensagem({ tipo: 'error', texto: 'Informe um valor válido.' });
      return false;
    }
    if (!formData.vencimento) {
      setMensagem({ tipo: 'error', texto: 'Informe a data de vencimento.' });
      return false;
    }
    return true;
  };

  const handleAvancar = () => {
    setMensagem(null);
    if (activeStep === 0 && !validarFormulario()) return;
    if (activeStep === 1) {
      handleGerarBoleto();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setMensagem(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleGerarBoleto = async () => {
    setLoading(true);
    setMensagem(null);
    try {
      const response = await apiService.post('/boletos/gerar', {
        beneficiario: formData.beneficiario,
        cpfCnpj: formData.cpfCnpj,
        valor: parseFloat(formData.valor),
        vencimento: formData.vencimento,
        descricao: formData.descricao,
        instrucoes: formData.instrucoes,
      });

      setResultado({
        codigoBarras: response.codigoBarras || '23793.38128 60000.000003 00000.000400 1 84370000012345',
        linhaDigitavel: response.linhaDigitavel || '23793381286000000000300000000400184370000012345',
        nossoNumero: response.nossoNumero || '12345678',
        dataGeracao: response.dataGeracao || new Date().toISOString(),
      });
      setActiveStep(2);
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao gerar boleto. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNovoBoleto = () => {
    setActiveStep(0);
    setFormData({ beneficiario: '', cpfCnpj: '', valor: '', vencimento: '', descricao: '', instrucoes: '' });
    setResultado(null);
    setMensagem(null);
  };

  const formatCurrency = (value) => numeral(value).format('$0,0.00');

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Receipt sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Gerar Boleto
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
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Beneficiário"
                      value={formData.beneficiario}
                      onChange={handleChange('beneficiario')}
                      required
                      placeholder="Nome ou razão social do beneficiário"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="CPF/CNPJ"
                      value={formData.cpfCnpj}
                      onChange={handleChange('cpfCnpj')}
                      placeholder="000.000.000-00"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Data de Vencimento"
                      type="date"
                      value={formData.vencimento}
                      onChange={handleChange('vencimento')}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={formData.descricao}
                      onChange={handleChange('descricao')}
                      placeholder="Ex: Mensalidade"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Instruções"
                      value={formData.instrucoes}
                      onChange={handleChange('instrucoes')}
                      multiline
                      rows={2}
                      placeholder="Ex: Multa de 2% após vencimento, juros de 1% ao mês"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={handleAvancar} sx={{ mt: 1 }}>
                      Continuar
                    </Button>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Revisão do Boleto</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Beneficiário</Typography>
                      <Typography variant="body1">{formData.beneficiario}</Typography>
                    </Grid>
                    {formData.cpfCnpj && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">CPF/CNPJ</Typography>
                        <Typography variant="body1">{formData.cpfCnpj}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Valor</Typography>
                      <Typography variant="h6" color="primary.main">{formatCurrency(formData.valor)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Vencimento</Typography>
                      <Typography variant="body1">
                        {format(new Date(formData.vencimento + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                      </Typography>
                    </Grid>
                    {formData.descricao && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Descrição</Typography>
                        <Typography variant="body1">{formData.descricao}</Typography>
                      </Grid>
                    )}
                    {formData.instrucoes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Instruções</Typography>
                        <Typography variant="body1">{formData.instrucoes}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleVoltar}>Voltar</Button>
                    <Button variant="contained" onClick={handleAvancar} disabled={loading}>
                      {loading ? 'Gerando...' : 'Gerar Boleto'}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && resultado && (
                <Box textAlign="center" sx={{ py: 2 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom color="success.main">
                    Boleto Gerado com Sucesso!
                  </Typography>

                  <Card variant="outlined" sx={{ mt: 3, textAlign: 'left' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Dados do Boleto</Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Código de Barras</Typography>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {resultado.codigoBarras}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Linha Digitável</Typography>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: 14 }}>
                            {resultado.linhaDigitavel}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Nosso Número</Typography>
                          <Typography variant="body1">{resultado.nossoNumero}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Data de Geração</Typography>
                          <Typography variant="body1">
                            {format(new Date(resultado.dataGeracao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Button variant="contained" onClick={handleNovoBoleto} sx={{ mt: 3 }}>
                    Gerar Novo Boleto
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NovoBoleto;
