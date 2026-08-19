import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { WifiOff, Refresh } from '@mui/icons-material';

function Offline() {
  const [tentando, setTentando] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      window.location.href = '/';
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleTentarNovamente = () => {
    setTentando(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = '/';
      } else {
        setTentando(false);
      }
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1565C0 0%, #1976d2 50%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Aurix Banking
          </Typography>

          <WifiOff sx={{ fontSize: 72, color: 'text.secondary', my: 3 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Sem Conexão
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Parece que você está sem conexão com a internet.
            Verifique sua rede e tente novamente.
          </Typography>

          <Box
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'left',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Algumas funcionalidades podem estar indisponíveis enquanto a conexão estiver
              interrompida. Dados em cache podem estar disponíveis.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleTentarNovamente}
            disabled={tentando}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            {tentando ? 'Verificando...' : 'Tentar Novamente'}
          </Button>

          <Box sx={{ mt: 3, fontSize: 13, color: 'text.secondary', lineHeight: 1.6 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              <strong>Dicas:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              - Verifique se o Wi-Fi está conectado
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              - Tente alternar entre Wi-Fi e dados móveis
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              - Reinicie o roteador se necessário
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Offline;
