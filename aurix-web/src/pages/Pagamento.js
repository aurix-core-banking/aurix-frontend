import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Payment } from '@mui/icons-material';
import numeral from 'numeral';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiService } from '../services/apiService';

const boletoMock = {
  descricao: 'Concessionária ABC Ltda',
  vencimento: '2024-02-15',
  valor: 1250.00,
  multa: 12.50,
  juros: 5.00,
  status: 'PENDENTE',
};

function Pagamento({ user }) {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [boletoInfo, setBoletoInfo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!codigoBarras) return;
    setLoading(true);
    try {
      const data = await apiService.get('/boletos/consultar', { params: { codigoBarras } });
      setBoletoInfo(data);
      setSuccess(false);
    } catch (error) {
      setBoletoInfo({
        descricao: 'Boleto não encontrado',
        vencimento: new Date().toISOString(),
        valor: 0,
        multa: 0,
        juros: 0,
        status: 'ERRO',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      await apiService.criarTransacao({
        tipo: 'PAGAMENTO_BOLETO',
        descricao: `Pagamento ${boletoInfo.descricao}`,
        valor: boletoInfo.valor + boletoInfo.multa + boletoInfo.juros,
        codigoBarras,
      });
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao pagar boleto:', error);
    }
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Payment sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h4">Pagamento</Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Código de Barras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleConsultar}
                disabled={!codigoBarras}
              >
                Consultar
              </Button>
            </Grid>
          </Grid>

          {boletoInfo && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Informações do Boleto</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Beneficiário</Typography>
                    <Typography variant="body1">{boletoInfo.descricao}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Vencimento</Typography>
                    <Typography variant="body1">{format(new Date(boletoInfo.vencimento), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                    <Typography variant="body1">{numeral(boletoInfo.valor).format('$0,0.00')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Multa</Typography>
                    <Typography variant="body1">{numeral(boletoInfo.multa).format('$0,0.00')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Juros</Typography>
                    <Typography variant="body1">{numeral(boletoInfo.juros).format('$0,0.00')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={boletoInfo.status}
                      color={boletoInfo.status === 'PENDENTE' ? 'warning' : 'success'}
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Box mt={3}>
                  <Button variant="contained" onClick={handlePagar}>
                    Pagar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Pagamento realizado com sucesso!
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Pagamento</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Deseja realizar o pagamento no valor de{' '}
            <strong>{boletoInfo && numeral(boletoInfo.valor).format('$0,0.00')}</strong>?
          </Typography>
          {boletoInfo && (
            <Box mt={1}>
              <Typography variant="body2" color="text.secondary">Beneficiário</Typography>
              <Typography variant="body1">{boletoInfo.descricao}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Vencimento</Typography>
              <Typography variant="body1">{format(new Date(boletoInfo.vencimento), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Pagamento;
