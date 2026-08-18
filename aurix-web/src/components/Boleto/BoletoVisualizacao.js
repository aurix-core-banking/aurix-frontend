import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Alert,
  Divider,
  Tooltip,
  Chip,
  Paper,
} from '@mui/material';
import {
  ContentCopy,
  Download,
  QrCode,
  Receipt,
  CalendarToday,
  AttachMoney,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import QRCodeLib from 'qrcode';

const formatarLinhaDigitavel = (codigoBarras) => {
  if (!codigoBarras || codigoBarras.length !== 44) return '';

  const c1 = codigoBarras.substring(0, 4) + '.' + codigoBarras.substring(4, 9);
  const c2 = codigoBarras.substring(9, 14) + '.' + codigoBarras.substring(14, 19) + codigoBarras.substring(19, 20);
  const c3 = codigoBarras.substring(20, 25) + '.' + codigoBarras.substring(25, 30) + codigoBarras.substring(30, 31);
  const c4 = codigoBarras.substring(31, 32);
  const c5 = codigoBarras.substring(32, 46);

  return `${c1} ${c2} ${c3} ${c4} ${c5}`;
};

const formatarCodigoBarras = (codigo) => {
  if (!codigo) return '';
  return codigo.replace(/(\d{4})(?=\d)/g, '$1.').replace(/\.$/, '');
};

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const formatarData = (dataString) => {
  if (!dataString) return '';
  return new Date(dataString).toLocaleDateString('pt-BR');
};

const getStatusBoleto = (status) => {
  switch (status) {
    case 'PAGO':
      return { cor: 'success', icone: <CheckCircle />, label: 'Pago' };
    case 'VENCIDO':
      return { cor: 'error', icone: <Warning />, label: 'Vencido' };
    case 'PENDENTE':
      return { cor: 'warning', icone: <CalendarToday />, label: 'Pendente' };
    case 'CANCELADO':
      return { cor: 'default', icone: <Warning />, label: 'Cancelado' };
    default:
      return { cor: 'default', icone: null, label: status || 'Desconhecido' };
  }
};

const BoletoVisualizacao = ({
  boleto,
  codigoBarras,
  linhaDigitavel,
  valor,
  vencimento,
  beneficiario,
  pagador,
  status,
  onCopiarCodigo,
}) => {
  const [copiado, setCopiado] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [erro, setErro] = useState('');

  const codigo = boleto?.codigoBarras || codigoBarras || '';
  const linha = boleto?.linhaDigitavel || linhaDigitavel || formatarLinhaDigitavel(codigo);
  const valorBoleto = boleto?.valor || valor || 0;
  const dataVencimento = boleto?.dataVencimento || vencimento || '';
  const nomeBeneficiario = boleto?.beneficiario || beneficiario || '';
  const nomePagador = boleto?.pagador || pagador || '';
  const statusBoleto = boleto?.status || status || 'PENDENTE';
  const statusInfo = getStatusBoleto(statusBoleto);

  const gerarQrCodeBoleto = async () => {
    if (!codigo || codigo.length !== 44) {
      setErro('Código de barras inválido');
      return;
    }

    try {
      const dataUrl = await QRCodeLib.toDataURL(codigo, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      setErro('Erro ao gerar QR Code do boleto');
    }
  };

  const copiarCodigo = async (texto, tipo) => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiado(tipo);
    setTimeout(() => setCopiado(''), 2000);
    if (onCopiarCodigo) onCopiarCodigo(texto, tipo);
  };

  const baixarBoleto = () => {
    const conteudo = `
BOLETO DE PAGAMENTO

Beneficiário: ${nomeBeneficiario}
Pagador: ${nomePagador}
Vencimento: ${formatarData(dataVencimento)}
Valor: ${formatarMoeda(valorBoleto)}

Código de Barras: ${codigo}
Linha Digitável: ${linha}
    `.trim();

    const blob = new Blob([conteudo], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `boleto-${codigo.slice(0, 10)}-${Date.now()}.txt`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Receipt sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Boleto
          </Typography>
          <Chip
            icon={statusInfo.icone}
            label={statusInfo.label}
            color={statusInfo.cor}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Beneficiário
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {nomeBeneficiario || '-'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Pagador
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {nomePagador || '-'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Vencimento
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatarData(dataVencimento) || '-'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Valor
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {formatarMoeda(valorBoleto)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {codigo && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Código de Barras (44 dígitos)
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  letterSpacing: 1,
                  flex: 1,
                  wordBreak: 'break-all',
                }}
              >
                {formatarCodigoBarras(codigo)}
              </Typography>
              <Tooltip title={copiado === 'codigo' ? 'Copiado!' : 'Copiar código'}>
                <IconButton
                  size="small"
                  onClick={() => copiarCodigo(codigo, 'codigo')}
                  color={copiado === 'codigo' ? 'success' : 'primary'}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {linha && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Linha Digitável
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  letterSpacing: 0.5,
                  flex: 1,
                  wordBreak: 'break-all',
                }}
              >
                {linha}
              </Typography>
              <Tooltip title={copiado === 'linha' ? 'Copiado!' : 'Copiar linha digitável'}>
                <IconButton
                  size="small"
                  onClick={() => copiarCodigo(linha, 'linha')}
                  color={copiado === 'linha' ? 'success' : 'primary'}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {copiado && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Copiado para a área de transferência!
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          {qrDataUrl ? (
            <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <img
                src={qrDataUrl}
                alt="QR Code Boleto"
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<QrCode />}
              onClick={gerarQrCodeBoleto}
              disabled={!codigo || codigo.length !== 44}
            >
              Gerar QR Code
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {codigo && (
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => copiarCodigo(codigo, 'codigo')}
            >
              Copiar Código
            </Button>
          )}
          {linha && (
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => copiarCodigo(linha, 'linha')}
            >
              Copiar Linha Digitável
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={baixarBoleto}
            disabled={!codigo}
          >
            Baixar Boleto
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BoletoVisualizacao;
