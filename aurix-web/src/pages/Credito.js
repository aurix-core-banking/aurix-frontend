import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

function Credito({ user }) {
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSimular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const res = await fetch(`${base}/api/credit/simulador?valor=${encodeURIComponent(valor)}`);
      const data = await res.json().catch(() => ({}));
      setMessage(res.ok ? 'Simulacao: ' + JSON.stringify(data) : (data.message || 'Erro ao simular'));
    } catch (err) {
      setMessage('Erro: ' + (err.message || 'tente novamente'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Credito</Typography>
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>Solicitacao de credito e simulador</Typography>
          <form onSubmit={handleSimular}>
            <TextField fullWidth label="Valor desejado (R$)" type="number" value={valor} onChange={(e) => setValor(e.target.value)} margin="normal" />
            <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>Simular</Button>
          </form>
          {message && <Typography color="textSecondary" sx={{ mt: 2 }}>{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Credito;
