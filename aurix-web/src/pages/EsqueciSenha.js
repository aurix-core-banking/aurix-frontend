import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  AccountCircle,
  Send,
  VpnKey,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';

const obterMensagemErro = (error) => {
  const status = error.response?.status;
  if (status === 404) return 'CPF não encontrado';
  return error.response?.data?.message || error.message || 'Falha ao recuperar senha';
};

const EsqueciSenha = () => {
  const [etapa, setEtapa] = useState('cpf');
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substr(0, 14);
  };

  const handleSolicitar = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSucesso('');

    try {
      if (!cpf) {
        throw new Error('Informe o CPF cadastrado');
      }
      await authService.requestPasswordReset(cpf);
      setSucesso('Enviamos um código de recuperação para seu e-mail/SMS cadastrado.');
      setEtapa('reset');
    } catch (err) {
      setError(obterMensagemErro(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSucesso('');

    try {
      if (!codigo || !novaSenha) {
        throw new Error('Informe o código e a nova senha');
      }
      if (novaSenha.length < 8) {
        throw new Error('A nova senha deve ter pelo menos 8 caracteres');
      }
      await authService.resetPassword(cpf, codigo, novaSenha);
      setSucesso('Senha redefinida com sucesso. Você já pode acessar o internet banking.');
      setEtapa('sucesso');
    } catch (err) {
      setError(obterMensagemErro(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                🏛️ AUREUS Banking
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Recuperar senha
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              {sucesso && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {sucesso}
                </Alert>
              )}

              {etapa === 'cpf' && (
                <form onSubmit={handleSolicitar}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle color="action" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="000.000.000-00"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Send />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    {loading ? 'Enviando...' : 'Enviar código'}
                  </Button>

                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2">
                      Voltar para o login
                    </Link>
                  </Box>
                </form>
              )}

              {etapa === 'reset' && (
                <form onSubmit={handleReset}>
                  <TextField
                    fullWidth
                    label="Código de recuperação"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Nova senha"
                    type={showSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowSenha(!showSenha)} edge="end">
                            {showSenha ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    {loading ? 'Redefinindo...' : 'Redefinir senha'}
                  </Button>
                </form>
              )}

              {etapa === 'sucesso' && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
                  >
                    Ir para o login
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default EsqueciSenha;
