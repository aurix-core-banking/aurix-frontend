import React, { useState } from 'react';
import { Box, Button, Alert, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import TipoSelector from '../components/Onboarding/TipoSelector';
import FormPF from '../components/Onboarding/FormPF';
import WizardPJ from '../components/Onboarding/FormPJ/WizardPJ';
import TrackingPJ from '../components/Onboarding/TrackingPJ';

function Onboarding({ user }) {
  const [mode, setMode] = useState('select');
  const [tipo, setTipo] = useState(null);
  const [solicitacaoId, setSolicitacaoId] = useState(null);

  const handleSelect = (selectedTipo) => {
    setTipo(selectedTipo);
    setMode('form');
  };

  const handleComplete = (id) => {
    setSolicitacaoId(id);
    if (tipo === 'PF') {
      setMode('success');
    } else {
      setMode('tracking');
    }
  };

  const handleNew = () => {
    setMode('select');
    setTipo(null);
    setSolicitacaoId(null);
  };

  if (mode === 'select') {
    return <TipoSelector onSelect={handleSelect} />;
  }

  if (mode === 'success') {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          Solicitação enviada com sucesso! Número de protocolo: <strong>#{solicitacaoId}</strong>
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Acompanhe o andamento pelo seu e-mail ou entre em contato com nosso suporte.
        </Typography>
        <Button variant="outlined" onClick={handleNew}>Nova solicitação</Button>
      </Box>
    );
  }

  if (mode === 'tracking' && solicitacaoId) {
    return <TrackingPJ solicitacaoId={solicitacaoId} onNew={handleNew} />;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={handleNew} sx={{ mb: 2 }}>
        Voltar
      </Button>
      {tipo === 'PF' ? (
        <FormPF onComplete={handleComplete} />
      ) : (
        <WizardPJ onComplete={handleComplete} />
      )}
    </Box>
  );
}

export default Onboarding;
