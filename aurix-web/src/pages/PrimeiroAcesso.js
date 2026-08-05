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
  Email,
  Phone,
  PersonAdd,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';

const obterMensagemErro = (error) => {
  const status = error.response?.status;
  if (status === 400) {
    return error.response?.data?.details?.map((d) => d.message).join(', ')
      || 'Dados inválidos. Verifique as informações informadas.';
  }
  return error.response?.data?.message || error.message || 'Falha ao criar conta';
};

const PrimeiroAcesso = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: field === 'cpf' ? formatCPF(event.target.value) : event.target.value,
    });
    if (error) setError('');
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substr(0, 14);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.cpf || !formData.nome || !formData.email || !formData.senha) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      if (formData.senha.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }
      if (formData.senha !== formData.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      await authService.register({
        cpf: formData.cpf,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
      });
      setSucesso(true);
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
                Primeiro acesso
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
                  Conta criada com sucesso! Entre com seu CPF e senha.
                </Alert>
              )}

              {!sucesso && (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Nome completo"
                    value={formData.nome}
                    onChange={handleChange('nome')}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="CPF"
                    value={formData.cpf}
                    onChange={handleChange('cpf')}
                    margin="normal"
                    required
                    placeholder="000.000.000-00"
                  />

                  <TextField
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.telefone}
                    onChange={handleChange('telefone')}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Senha"
                    type={showSenha ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={handleChange('senha')}
                    margin="normal"
                    required
                    helperText="Mínimo de 8 caracteres"
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

                  <TextField
                    fullWidth
                    label="Confirmar senha"
                    type={showSenha ? 'text' : 'password'}
                    value={formData.confirmarSenha}
                    onChange={handleChange('confirmarSenha')}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
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
                    startIcon={<PersonAdd />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>

                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2">
                      Voltar para o login
                    </Link>
                  </Box>
                </form>
              )}

              {sucesso && (
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PrimeiroAcesso;
