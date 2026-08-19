import React, { Component } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class LimitrofeErros extends Component {
  constructor(props) {
    super(props);
    this.state = { erro: null, infoErro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, infoErro) {
    this.setState({ infoErro });
    if (this.props.onError) {
      this.props.onError(erro, infoErro);
    }
    // Log em produção: enviar serviço de tracking (Sentry, etc.)
    console.error('[LimitrofeErros] Erro capturado:', erro, infoErro);
  }

  handleTentarNovamente = () => {
    this.setState({ erro: null, infoErro: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { erro } = this.state;
    const { children, fallbackPersonalizado, titulo, mensagem } = this.props;

    if (!erro) {
      return children;
    }

    if (fallbackPersonalizado) {
      return fallbackPersonalizado({
        erro,
        infoErro: this.state.infoErro,
        tentarNovamente: this.handleTentarNovamente,
      });
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          m: 2,
          border: '1px solid',
          borderColor: 'error.light',
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: 'error.lightest || #fff5f5',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
          {titulo || 'Algo deu errado'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          {mensagem || 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.'}
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
          <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {erro.message}
            {this.state.infoErro?.componentStack && (
              <>
                {'\n\n'}
                {this.state.infoErro.componentStack}
              </>
            )}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleTentarNovamente}
          >
            Tentar Novamente
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Recarregar Página
          </Button>
        </Box>
      </Paper>
    );
  }
}

export default LimitrofeErros;
