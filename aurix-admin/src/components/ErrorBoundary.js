import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error">
            Oops! Algo deu errado
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="body2">
              <strong>Erro:</strong> {this.state.error?.message || 'Erro desconhecido'}
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={{ marginTop: 10 }}>
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre style={{ fontSize: '12px', marginTop: 10 }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </Alert>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={this.handleReload}
            size="large"
          >
            Recarregar Página
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
