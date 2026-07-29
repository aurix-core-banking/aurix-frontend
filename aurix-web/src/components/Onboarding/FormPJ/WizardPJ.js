import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import StepEmpresa from './StepEmpresa';
import StepSocios from './StepSocios';
import StepDocumentos from './StepDocumentos';
import StepRevisao from './StepRevisao';
import { apiService } from '../../../services/apiService';

const steps = ['Dados da Empresa', 'Sócios', 'Documentos', 'Revisão'];

function WizardPJ({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [solicitacaoId, setSolicitacaoId] = useState(null);
  const [form, setForm] = useState({});
  const [sociosCount, setSociosCount] = useState(0);
  const [documentosCount, setDocumentosCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!form.cnpj || !form.razaoSocial || !form.email) {
        setError('CNPJ, Razão Social e E-mail são obrigatórios');
        return;
      }
      setError('');
      setLoading(true);
      try {
        const payload = {
          cnpj: form.cnpj.replace(/\D/g, ''),
          razaoSocial: form.razaoSocial,
          nomeFantasia: form.nomeFantasia || null,
          email: form.email,
          telefone: form.telefone?.replace(/\D/g, '') || null,
          endereco: form.endereco || null,
        };
        const res = await apiService.criarSolicitacaoPJ(payload);
        setSolicitacaoId(res.data.id);
        setActiveStep(1);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao criar solicitação');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    onComplete(solicitacaoId);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return <StepEmpresa form={form} setForm={setForm} error={error} solicitacaoId={solicitacaoId} />;
      case 1: return <StepSocios solicitacaoId={solicitacaoId} onSocioChange={setSociosCount} />;
      case 2: return <StepDocumentos solicitacaoId={solicitacaoId} onDocumentoChange={setDocumentosCount} />;
      case 3: return <StepRevisao form={form} sociosCount={sociosCount} documentosCount={documentosCount} solicitacaoId={solicitacaoId} />;
      default: return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Abertura de conta PJ</Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
      <Card>
        <CardContent>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>Anterior</Button>
            {activeStep < 3 ? (
              <Button variant="contained" onClick={handleNext} disabled={loading}>
                {activeStep === 0 ? (loading ? 'Criando...' : 'Criar solicitação') : 'Próximo'}
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleFinish}>
                Ver acompanhamento
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default WizardPJ;
