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
  Divider,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
  Security,
  Fingerprint,
  Send
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const obterMensagemErro = (error) => {
  const status = error.response?.status;
  if (status === 401) return 'CPF ou senha inválidos';
  if (status === 423) return 'Conta bloqueada. Entre em contato com o suporte';
  return error.response?.data?.message || error.message || 'Falha na autenticação';
};

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState('credenciais');
  const [formData, setFormData] = useState({
    cpf: '',
    senha: '',
    codigo: '',
  });
  const [codigoToken, setCodigoToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.cpf || !formData.senha) {
        throw new Error('CPF e senha são obrigatórios');
      }

      const resultado = await onLogin({
        cpf: formData.cpf,
        senha: formData.senha,
      });

      if (resultado?.mfaRequired || resultado?.mfaObrigatorio) {
        setCodigoToken(resultado.codigoToken);
        await authService.gerarTokenMFA(formData.cpf);
        setEtapa('mfa');
        setError('');
      }
    } catch (err) {
      setError(obterMensagemErro(err));
    } finally {
      setLoading(false);
    }
  };

  const handleValidarMFA = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.codigo) {
        throw new Error('Informe o código recebido por e-mail ou SMS');
      }

      const resultado = await authService.validarMFA(codigoToken || formData.cpf, formData.codigo);
      if (resultado?.token && resultado?.user) {
        await onLogin({ token: resultado.token, user: resultado.user });
      } else {
        setError('Token inválido. Tente novamente.');
      }
    } catch (err) {
      setError(obterMensagemErro(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometria = async () => {
    setLoading(true);
    setError('');
    try {
      if (!formData.cpf) {
        throw new Error('Informe o CPF antes de usar a biometria');
      }
      const resultado = await authService.gerarTokenMFA(formData.cpf);
      setCodigoToken(resultado?.codigoToken);
      setEtapa('mfa');
      setError('');
    } catch (err) {
      setError(obterMensagemErro(err));
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substr(0, 14);
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
                Internet Banking Seguro
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {etapa === 'credenciais' ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
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

                  <TextField
                    fullWidth
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={handleChange('senha')}
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
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ou
                    </Typography>
                  </Divider>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Fingerprint />}
                    onClick={handleBiometria}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    Entrar com Biometria
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleValidarMFA}>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Enviamos um código de segurança para seu e-mail/SMS cadastrado.
                  </Alert>

                  <TextField
                    fullWidth
                    label="Código de segurança"
                    value={formData.codigo}
                    onChange={handleChange('codigo')}
                    margin="normal"
                    required
                    inputProps={{ inputMode: 'numeric' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security color="action" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="000000"
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
                    {loading ? 'Validando...' : 'Validar código'}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setEtapa('credenciais')}
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                </form>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link component={RouterLink} to="/esqueci-senha" variant="body2" sx={{ mr: 2 }}>
                  Esqueci minha senha
                </Link>
                <Link component={RouterLink} to="/primeiro-acesso" variant="body2">
                  Primeiro acesso
                </Link>
              </Box>

              <Paper
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  Ambiente seguro com autenticação de múltiplos fatores (MFA).
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
