import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

// Components
import UnifiedShell from './components/shell/UnifiedShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contas from './pages/Contas';
import Transacoes from './pages/Transacoes';
import PIX from './pages/PIX';
import Investimentos from './pages/Investimentos';
import Cartoes from './pages/Cartoes';
import Extrato from './pages/Extrato';
import Transferencia from './pages/Transferencia';
import Pagamento from './pages/Pagamento';
import Recarga from './pages/Recarga';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';
import Onboarding from './pages/Onboarding';
import Credito from './pages/Credito';

// Services
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('aurix_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('aurix_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login({
        cpf: credentials.cpf?.replace(/\D/g, ''),
        senha: credentials.senha,
        token: credentials.token,
      });
      localStorage.setItem('aurix_token', response.token || 'mock_token');
      setUser(response.user || credentials);
      setIsAuthenticated(true);
      showNotification('Login realizado com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro no login: ' + (error.message || 'Credenciais inválidas'), 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aurix_token');
    setUser(null);
    setIsAuthenticated(false);
    showNotification('Logout realizado com sucesso!', 'info');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div>Carregando...</div>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <CssBaseline />
      <UnifiedShell user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/contas" element={<Contas user={user} />} />
          <Route path="/transacoes" element={<Transacoes user={user} />} />
          <Route path="/pix" element={<PIX user={user} />} />
          <Route path="/investimentos" element={<Investimentos user={user} />} />
          <Route path="/cartoes" element={<Cartoes user={user} />} />
          <Route path="/extrato" element={<Extrato user={user} />} />
          <Route path="/perfil" element={<Perfil user={user} />} />
          <Route path="/configuracoes" element={<Configuracoes user={user} />} />
          <Route path="/onboarding" element={<Onboarding user={user} />} />
          <Route path="/credito" element={<Credito user={user} />} />
          <Route path="/transferencia" element={<Transferencia user={user} />} />
          <Route path="/pagamento" element={<Pagamento user={user} />} />
          <Route path="/recarga" element={<Recarga user={user} />} />
        </Routes>
      </UnifiedShell>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default App;
