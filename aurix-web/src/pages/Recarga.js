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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { PhoneAndroid } from '@mui/icons-material';

const operadoras = ['Vivo', 'Claro', 'TIM', 'Oi'];

const valores = [
  { label: 'R$ 10,00', value: 10 },
  { label: 'R$ 15,00', value: 15 },
  { label: 'R$ 20,00', value: 20 },
  { label: 'R$ 50,00', value: 50 },
  { label: 'R$ 100,00', value: 100 },
  { label: 'Outro valor', value: 'outro' },
];

function Recarga({ user }) {
  const [operadora, setOperadora] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [outroValor, setOutroValor] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const isFormValid = operadora && telefone && (valor || (valor === 'outro' && outroValor));

  const valorExibido = valor === 'outro'
    ? `R$ ${parseFloat(outroValor).toFixed(2)}`
    : valores.find(v => v.value === valor)?.label || '';

  const handleConfirmar = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSuccess(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <PhoneAndroid sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h4">Recarga</Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <FormLabel id="operadora-label" sx={{ mb: 1, display: 'block' }}>
                  Operadora
                </FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={operadora}
                  exclusive
                  onChange={(e, value) => value && setOperadora(value)}
                  aria-labelledby="operadora-label"
                  fullWidth
                >
                  {operadoras.map((op) => (
                    <ToggleButton key={op} value={op}>{op}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="valor-label">Valor</InputLabel>
                <Select
                  labelId="valor-label"
                  label="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                >
                  {valores.map((v) => (
                    <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {valor === 'outro' && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Outro Valor"
                  type="number"
                  value={outroValor}
                  onChange={(e) => setOutroValor(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
            )}
          </Grid>

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={handleConfirmar}
              disabled={!isFormValid}
              startIcon={<PhoneAndroid />}
            >
              Confirmar
            </Button>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Recarga realizada com sucesso!
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Recarga</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Deseja realizar a recarga de <strong>{valorExibido}</strong> para o número{' '}
            <strong>{telefone}</strong> na operadora <strong>{operadora}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Recarga;
