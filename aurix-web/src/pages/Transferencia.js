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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { SwapHoriz } from '@mui/icons-material';
import numeral from 'numeral';

function Transferencia({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [tipo, setTipo] = useState('TED');
  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    digito: '',
    chavePix: '',
    tipoChave: 'CPF',
    valor: '',
    dataAgendamento: '',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const isTEDorDOC = tipo === 'TED' || tipo === 'DOC';

  const handleTransferir = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSuccess(true);
    setActiveStep(2);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <SwapHoriz sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h4">Transferência</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Dados</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmação</StepLabel>
            </Step>
            <Step>
              <StepLabel>Concluído</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="tipo-label">Tipo de Transferência</InputLabel>
                    <Select
                      labelId="tipo-label"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      label="Tipo de Transferência"
                    >
                      <MenuItem value="TED">TED</MenuItem>
                      <MenuItem value="DOC">DOC</MenuItem>
                      <MenuItem value="PIX">PIX</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {isTEDorDOC ? (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Banco"
                        value={formData.banco}
                        onChange={handleChange('banco')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Agência"
                        value={formData.agencia}
                        onChange={handleChange('agencia')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Conta"
                        value={formData.conta}
                        onChange={handleChange('conta')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Dígito"
                        value={formData.digito}
                        onChange={handleChange('digito')}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel id="tipo-chave-label">Tipo de Chave</InputLabel>
                        <Select
                          labelId="tipo-chave-label"
                          value={formData.tipoChave}
                          onChange={handleChange('tipoChave')}
                          label="Tipo de Chave"
                        >
                          <MenuItem value="CPF">CPF</MenuItem>
                          <MenuItem value="CNPJ">CNPJ</MenuItem>
                          <MenuItem value="EMAIL">E-mail</MenuItem>
                          <MenuItem value="TELEFONE">Telefone</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Chave PIX"
                        value={formData.chavePix}
                        onChange={handleChange('chavePix')}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valor"
                    type="number"
                    value={formData.valor}
                    onChange={handleChange('valor')}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Data de Agendamento"
                    type="date"
                    value={formData.dataAgendamento}
                    onChange={handleChange('dataAgendamento')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  onClick={handleTransferir}
                  disabled={!formData.valor}
                  startIcon={<SwapHoriz />}
                >
                  Transferir
                </Button>
              </Box>
            </>
          )}

          {activeStep === 2 && success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Transferência agendada com sucesso!
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Transferência</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Tipo</Typography>
              <Typography variant="body1">{tipo}</Typography>
            </Grid>
            {isTEDorDOC ? (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Banco</Typography>
                  <Typography variant="body1">{formData.banco}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Agência</Typography>
                  <Typography variant="body1">{formData.agencia}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Conta</Typography>
                  <Typography variant="body1">{formData.conta}-{formData.digito}</Typography>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Chave PIX</Typography>
                <Typography variant="body1">{formData.chavePix}</Typography>
              </Grid>
            )}
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Valor</Typography>
              <Typography variant="body1">{numeral(parseFloat(formData.valor) || 0).format('$0,0.00')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Data de Agendamento</Typography>
              <Typography variant="body1">{formData.dataAgendamento}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Transferencia;
