import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Security, Notifications, Language } from '@mui/icons-material';
import { apiService } from '../services/apiService';

function Configuracoes({ user }) {
  const [configs, setConfigs] = useState({
    notificacoesEmail: true,
    notificacoesSMS: false,
    notificacoesPush: true,
    autenticacaoDuploFator: false,
    idioma: 'pt-BR',
  });

  const handleToggle = (key) => {
    const newConfigs = { ...configs, [key]: !configs[key] };
    setConfigs(newConfigs);
    apiService.atualizarConfiguracoes(newConfigs).catch(err => console.error('Erro ao salvar:', err));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Security sx={{ mr: 1 }} />
            <Typography variant="h6">Segurança</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={configs.autenticacaoDuploFator}
                onChange={() => handleToggle('autenticacaoDuploFator')}
              />
            }
            label="Autenticação de Dois Fatores (2FA)"
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Notifications sx={{ mr: 1 }} />
            <Typography variant="h6">Notificações</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={configs.notificacoesEmail}
                onChange={() => handleToggle('notificacoesEmail')}
              />
            }
            label="Notificações por E-mail"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.notificacoesSMS}
                onChange={() => handleToggle('notificacoesSMS')}
              />
            }
            label="Notificações por SMS"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.notificacoesPush}
                onChange={() => handleToggle('notificacoesPush')}
              />
            }
            label="Notificações Push"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Language sx={{ mr: 1 }} />
            <Typography variant="h6">Preferências</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Idioma"
                value={configs.idioma}
                onChange={(e) => setConfigs({ ...configs, idioma: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Configuracoes;
