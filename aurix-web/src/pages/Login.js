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
  Fingerprint
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    senha: '',
    token: '',
    biometria: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);
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
      // Simular validação
      if (!formData.cpf || !formData.senha) {
        throw new Error('CPF e senha são obrigatórios');
      }

      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock user data
      const userData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@aurix.com.br',
        cpf: formData.cpf,
        telefone: '(11) 99999-9999',
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        conta: {
          numero: '12345-6',
          agencia: '0001',
          saldo: 15750.50,
          limite: 5000.00
        }
      };

      onLogin(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometria = () => {
    setFormData({ ...formData, biometria: true });
    // Simular biometria
    setTimeout(() => {
      const userData = {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@aurix.com.br',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        conta: {
          numero: '12345-6',
          agencia: '0001',
          saldo: 15750.50,
          limite: 5000.00
        }
      };
      onLogin(userData);
    }, 1500);
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

                <TextField
                  fullWidth
                  label="Token (opcional)"
                  type={showToken ? 'text' : 'password'}
                  value={formData.token}
                  onChange={handleChange('token')}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Security color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowToken(!showToken)}
                          edge="end"
                        >
                          {showToken ? <VisibilityOff /> : <Visibility />}
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
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Entrar com Biometria
                </Button>
              </form>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link href="#" variant="body2" sx={{ mr: 2 }}>
                  Esqueci minha senha
                </Link>
                <Link href="#" variant="body2">
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
                  <strong>Dados para teste:</strong><br />
                  CPF: 123.456.789-00<br />
                  Senha: 123456
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
