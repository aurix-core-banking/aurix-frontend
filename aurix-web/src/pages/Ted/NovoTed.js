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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { SwapHoriz, CheckCircle, Schedule } from '@mui/icons-material';
import numeral from 'numeral';
import { apiService } from '../../services/apiService';

const steps = ['Dados do Beneficiário', 'Valor e Descrição', 'Confirmação', 'Concluído'];

function NovoTed({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    ispb: '',
    nomeBanco: '',
    agencia: '',
    conta: '',
    digito: '',
    nomeBeneficiario: '',
    cpfCnpjBeneficiario: '',
    valor: '',
    descricao: '',
    dataAgendamento: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [senhaDialog, setSenhaDialog] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isHorarioSPB = () => {
    const agora = new Date();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();
    const tempo = hora * 60 + minuto;
    const inicio = 9 * 60;
    const fim = 17 * 60;
    const diaSemana = agora.getDay();
    return diaSemana >= 1 && diaSemana <= 5 && tempo >= inicio && tempo < fim;
  };

  const validarPasso = (step) => {
    switch (step) {
      case 0:
        if (!formData.ispb || !formData.agencia || !formData.conta) {
          setMensagem({ tipo: 'error', texto: 'Preencha ISPB, agência e conta.' });
          return false;
        }
        return true;
      case 1:
        if (!formData.valor || parseFloat(formData.valor) <= 0) {
          setMensagem({ tipo: 'error', texto: 'Informe um valor válido.' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleAvancar = () => {
    setMensagem(null);
    if (!validarPasso(activeStep)) return;
    if (activeStep === 2) {
      setSenhaDialog(true);
      return;
    }
    if (activeStep === 0 && !isHorarioSPB()) {
      setMensagem({
        tipo: 'warning',
        texto: 'Fora do horário de funcionamento do SPB (Seg-Sex, 09h-17h). A transferência será processada no próximo dia útil.',
      });
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setMensagem(null);
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
      const response = await apiService.post('/ted/enviar', {
        ispb: formData.ispb,
        agencia: formData.agencia,
        conta: formData.conta,
        digito: formData.digito,
        nomeBeneficiario: formData.nomeBeneficiario,
        cpfCnpjBeneficiario: formData.cpfCnpjBeneficiario,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
        dataAgendamento: formData.dataAgendamento || null,
        senha: formData.senha,
      });

      setResultado({
        protocolo: response.protocolo || 'TED-' + Date.now(),
        status: response.status || 'ENVIADA',
      });
      setActiveStep(3);
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao enviar TED. Tente novamente.',
      });
    } finally {
      setLoading(false);
      setFormData((prev) => ({ ...prev, senha: '' }));
    }
  };

  const handleNovaTed = () => {
    setActiveStep(0);
    setFormData({
      ispb: '', nomeBanco: '', agencia: '', conta: '', digito: '',
      nomeBeneficiario: '', cpfCnpjBeneficiario: '', valor: '',
      descricao: '', dataAgendamento: '', senha: '',
    });
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
                <SwapHoriz sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Novo TED
                </Typography>
              </Box>

              {!isHorarioSPB() && (
                <Alert severity="info" icon={<Schedule />} sx={{ mb: 2 }}>
                  Fora do horário do SPB. TEDs solicitados serão processados no próximo dia útil entre 09h e 17h.
                </Alert>
              )}

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
                    <TextField
                      fullWidth
                      label="ISPB do Banco"
                      value={formData.ispb}
                      onChange={handleChange('ispb')}
                      placeholder="Ex: 60701190"
                      required
                      helperText="Código ISPB do banco destino"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Nome do Banco"
                      value={formData.nomeBanco}
                      onChange={handleChange('nomeBanco')}
                      placeholder="Ex: Banco do Brasil"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Agência"
                      value={formData.agencia}
                      onChange={handleChange('agencia')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Conta"
                      value={formData.conta}
                      onChange={handleChange('conta')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Dígito"
                      value={formData.digito}
                      onChange={handleChange('digito')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nome do Beneficiário"
                      value={formData.nomeBeneficiario}
                      onChange={handleChange('nomeBeneficiario')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CPF/CNPJ do Beneficiário"
                      value={formData.cpfCnpjBeneficiario}
                      onChange={handleChange('cpfCnpjBeneficiario')}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
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
                <Grid container spacing={2}>
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
                      placeholder="Ex: Pagamento fornecedor"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Data de Agendamento"
                      type="date"
                      value={formData.dataAgendamento}
                      onChange={handleChange('dataAgendamento')}
                      InputLabelProps={{ shrink: true }}
                      helperText="Deixe vazio para envio imediato"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" onClick={handleVoltar}>Voltar</Button>
                      <Button variant="contained" onClick={handleAvancar} sx={{ flexGrow: 1 }}>
                        Continuar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Resumo da Transferência TED</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Banco</Typography>
                      <Typography variant="body1">{formData.nomeBanco || formData.ispb}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">ISPB</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{formData.ispb}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Agência</Typography>
                      <Typography variant="body1">{formData.agencia}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Conta</Typography>
                      <Typography variant="body1">{formData.conta}-{formData.digito}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Beneficiário</Typography>
                      <Typography variant="body1">{formData.nomeBeneficiario || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Valor</Typography>
                      <Typography variant="h6" color="primary.main">{formatCurrency(formData.valor)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Agendamento</Typography>
                      <Typography variant="body1">{formData.dataAgendamento || 'Imediato'}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleVoltar}>Voltar</Button>
                    <Button variant="contained" onClick={handleAvancar} disabled={loading}>
                      {loading ? 'Enviando...' : 'Confirmar com Senha'}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 3 && (
                <Box textAlign="center" sx={{ py: 3 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom color="success.main">
                    TED Enviada com Sucesso!
                  </Typography>
                  {resultado && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Protocolo: <strong>{resultado.protocolo}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: <Chip label={resultado.status} color="success" size="small" />
                      </Typography>
                    </Box>
                  )}
                  <Button variant="contained" onClick={handleNovaTed} sx={{ mt: 3 }}>
                    Novo TED
                  </Button>
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
            Informe sua senha para confirmar a transferência TED.
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

export default NovoTed;
