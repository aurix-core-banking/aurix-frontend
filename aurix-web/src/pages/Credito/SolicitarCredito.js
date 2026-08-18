import React, { useState, useEffect } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Description,
  AttachFile,
  Send,
} from '@mui/icons-material';
import { apiService } from '../../services/apiService';

const tiposCredito = [
  { value: 'CONSIGNADO', label: 'Crédito Consignado' },
  { value: 'PESSOAL', label: 'Crédito Pessoal' },
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'FGTS', label: 'Crédito FGTS' },
];

const finalidades = [
  { value: 'Pessoal', label: 'Necessidades Pessoais' },
  { value: 'Veiculo', label: 'Compra de Veículo' },
  { value: 'Imovel', label: 'Compra de Imóvel' },
  { value: 'Reforma', label: 'Reforma' },
  { value: 'Saude', label: 'Despesas de Saúde' },
  { value: 'Educacao', label: 'Educação' },
  { value: 'Viagem', label: 'Viagem' },
  { value: 'Outros', label: 'Outros' },
];

const documentosPorTipo = {
  CONSIGNADO: ['RG ou CNH', 'Comprovante de renda', 'Holerite (último)', 'Extrato INSS/Folha pagamento'],
  PESSOAL: ['RG ou CNH', 'CPF', 'Comprovante de residência', 'Comprovante de renda'],
  FINANCIAMENTO: ['RG ou CNH', 'CPF', 'Comprovante de residência', 'Comprovante de renda', 'Certidão de nascimento/casamento', 'CPRF (imóvel)'],
  FGTS: ['RG ou CNH', 'CPF', 'Carteira de trabalho', 'Extrato FGTS', 'Comprovante de vínculo empregatício'],
};

const steps = ['Dados da Solicitação', 'Documentos', 'Revisão', 'Resultado'];

function SolicitarCredito({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    tipoCredito: 'PESSOAL',
    valor: '',
    prazo: 36,
    finalidade: 'Pessoal',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      const data = await apiService.get('/creditos/solicitacoes');
      const lista = Array.isArray(data) ? data : data?.content || [];
      setSolicitacoes(lista);
    } catch (error) {
      setSolicitacoes([]);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvancar = () => {
    setMensagem(null);
    if (activeStep === 0) {
      if (!formData.valor || parseFloat(formData.valor) <= 0) {
        setMensagem({ tipo: 'error', texto: 'Informe um valor válido.' });
        return;
      }
    }
    if (activeStep === 3) {
      handleEnviarSolicitacao();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setMensagem(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleEnviarSolicitacao = async () => {
    setLoading(true);
    setMensagem(null);
    try {
      const response = await apiService.post('/creditos/solicitacoes', {
        tipoCredito: formData.tipoCredito,
        valor: parseFloat(formData.valor),
        prazoMeses: formData.prazo,
        finalidade: formData.finalidade,
        observacoes: formData.observacoes,
      });

      setResultado({
        id: response.id || 'SOL-' + Date.now(),
        status: response.status || 'ENVIADA',
        data: response.dataCriacao || new Date().toISOString(),
      });
      carregarSolicitacoes();
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao enviar solicitação. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNovaSolicitacao = () => {
    setActiveStep(0);
    setFormData({ tipoCredito: 'PESSOAL', valor: '', prazo: 36, finalidade: 'Pessoal', observacoes: '' });
    setResultado(null);
    setMensagem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROVADA': return 'success';
      case 'PENDENTE': return 'warning';
      case 'EM_ANALISE': return 'info';
      case 'REPROVADA': return 'error';
      case 'ENVIADA': return 'primary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'APROVADA': return 'Aprovada';
      case 'PENDENTE': return 'Pendente';
      case 'EM_ANALISE': return 'Em Análise';
      case 'REPROVADA': return 'Reprovada';
      case 'ENVIADA': return 'Enviada';
      default: return status;
    }
  };

  const documentosNecessarios = documentosPorTipo[formData.tipoCredito] || [];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Assignment sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h1">
                  Solicitar Crédito
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
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Crédito</InputLabel>
                      <Select
                        value={formData.tipoCredito}
                        onChange={handleChange('tipoCredito')}
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
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Finalidade</InputLabel>
                      <Select
                        value={formData.finalidade}
                        onChange={handleChange('finalidade')}
                        label="Finalidade"
                      >
                        {finalidades.map((f) => (
                          <MenuItem key={f.value} value={f.value}>
                            {f.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor Desejado"
                      type="number"
                      value={formData.valor}
                      onChange={handleChange('valor')}
                      inputProps={{ min: 100, step: 100 }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Prazo (meses)</InputLabel>
                      <Select
                        value={formData.prazo}
                        onChange={handleChange('prazo')}
                        label="Prazo (meses)"
                      >
                        {[12, 24, 36, 48, 60, 72, 84, 96, 120, 180, 240, 360].map((p) => (
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
                      label="Observações"
                      value={formData.observacoes}
                      onChange={handleChange('observacoes')}
                      multiline
                      rows={2}
                      placeholder="Informações adicionais sobre sua solicitação"
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
                  <Typography variant="h6" gutterBottom>
                    Documentos Necessários
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Para o tipo <strong>{tiposCredito.find((tc) => tc.value === formData.tipoCredito)?.label}</strong>,
                    os seguintes documentos são necessários:
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    {documentosNecessarios.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Description color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={doc}
                          secondary={index < 3 ? 'Obrigatório' : 'Se aplicável'}
                        />
                        <Chip
                          icon={<AttachFile />}
                          label="Anexar"
                          variant="outlined"
                          size="small"
                          onClick={() => {}}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Os documentos podem ser anexados após a submissão da solicitação, ou entregues presencialmente em uma agência.
                  </Alert>
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleVoltar}>Voltar</Button>
                    <Button variant="contained" onClick={handleAvancar} sx={{ flexGrow: 1 }}>
                      Continuar
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Revisão da Solicitação</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Tipo de Crédito</Typography>
                      <Typography variant="body1">
                        {tiposCredito.find((tc) => tc.value === formData.tipoCredito)?.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Finalidade</Typography>
                      <Typography variant="body1">
                        {finalidades.find((f) => f.value === formData.finalidade)?.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Valor</Typography>
                      <Typography variant="h6" color="primary.main">
                        R$ {parseFloat(formData.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Prazo</Typography>
                      <Typography variant="body1">{formData.prazo} meses</Typography>
                    </Grid>
                    {formData.observacoes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Observações</Typography>
                        <Typography variant="body1">{formData.observacoes}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleVoltar}>Voltar</Button>
                    <Button variant="contained" onClick={handleAvancar} disabled={loading}>
                      {loading ? 'Enviando...' : 'Enviar Solicitação'}
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 3 && resultado && (
                <Box textAlign="center" sx={{ py: 3 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom color="success.main">
                    Solicitação Enviada!
                  </Typography>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      Protocolo: <strong>{resultado.id}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: <Chip label={getStatusLabel(resultado.status)} color={getStatusColor(resultado.status)} size="small" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {new Date(resultado.data).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                  <Button variant="contained" onClick={handleNovaSolicitacao} sx={{ mt: 3 }}>
                    Nova Solicitação
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {solicitacoes.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Minhas Solicitações</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {solicitacoes.map((sol) => (
                    <ListItem key={sol.id} divider>
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${tiposCredito.find((tc) => tc.value === sol.tipoCredito)?.label || sol.tipoCredito} - R$ ${(sol.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        secondary={`Prazo: ${sol.prazoMeses} meses | Enviado: ${new Date(sol.dataCriacao || sol.data).toLocaleDateString('pt-BR')}`}
                      />
                      <Chip
                        label={getStatusLabel(sol.status)}
                        color={getStatusColor(sol.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default SolicitarCredito;
