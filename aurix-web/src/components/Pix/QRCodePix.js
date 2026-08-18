import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  CircularProgress,
} from '@mui/material';
import {
  QrCode,
  ContentCopy,
  Download,
  Refresh,
} from '@mui/icons-material';

const formatField = (id, value) => `${id}${String(value.length).padStart(2, '0')}${value}`;

const gerarPayloadPix = (chavePix, valor, txid) => {
  const merchantAccountInfo = formatField(
    '26',
    `${formatField('00', 'BR.GOV.BCB.PIX')}${formatField('01', chavePix)}`
  );

  const txId = txid || '***';
  const additionalDataField = formatField('62', formatField('05', txId));

  let valorField = '';
  if (valor && parseFloat(valor) > 0) {
    valorField = formatField('54', parseFloat(valor).toFixed(2));
  }

  const payloadSemCRC = `000201${merchantAccountInfo}${valorField}${additionalDataField}6304`;

  let crc = 0xFFFF;
  for (let i = 0; i < payloadSemCRC.length; i++) {
    crc ^= payloadSemCRC.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

  return `${payloadSemCRC}${crcHex}`;
};

const QRCodePix = ({
  chavePix = '',
  valor = 0,
  descricao = '',
  txid = '',
  tamanho = 256,
  onPayloadGerado,
}) => {
  const qrRef = useRef(null);
  const [payload, setPayload] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  const gerarPayload = useCallback(() => {
    if (!chavePix) {
      setErro('Chave PIX é obrigatória');
      return null;
    }

    setErro('');
    const payloadGerado = gerarPayloadPix(chavePix, valor, txid);
    setPayload(payloadGerado);

    if (onPayloadGerado) {
      onPayloadGerado({ payload: payloadGerado });
    }

    return payloadGerado;
  }, [chavePix, valor, txid, onPayloadGerado]);

  const copiarPayload = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const baixarComoImagem = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = tamanho;
    canvas.height = tamanho;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, tamanho, tamanho);
      const link = document.createElement('a');
      link.download = `pix-qrcode-${chavePix.slice(0, 8)}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const formatarChave = (chave) => {
    if (!chave) return '';
    if (chave.length === 11) {
      return chave.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (chave.length === 14) {
      return chave.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return chave;
  };

  const payloadExistente = payload || (chavePix ? gerarPayloadPix(chavePix, valor, txid) : '');

  return (
    <Card sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <QrCode sx={{ mr: 1, color: '#00a86b' }} />
          <Typography variant="h6">QR Code PIX</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Chave PIX"
              value={chavePix}
              size="small"
              InputProps={{ readOnly: true }}
              helperText={formatarChave(chavePix)}
            />
          </Grid>
          {valor > 0 && (
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Valor"
                value={`R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`}
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          )}
          {descricao && (
            <Grid item xs={valor > 0 ? 6 : 12}>
              <TextField
                fullWidth
                label="Descrição"
                value={descricao}
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {chavePix ? (
            <Box
              ref={qrRef}
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: '#ffffff',
                display: 'inline-block',
              }}
            >
              <QRCodeSVG
                value={payloadExistente}
                size={tamanho}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: tamanho,
                height: tamanho,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
              }}
            >
              <QrCode sx={{ fontSize: 48, color: '#bdbdbd' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Informe a chave PIX
              </Typography>
            </Box>
          )}
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {copiado && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Payload copiado para a área de transferência!
          </Alert>
        )}

        {payload && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Payload (Copia e Cola):
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: 1,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                maxHeight: 80,
                overflow: 'auto',
              }}
            >
              {payload}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {chavePix && (
            <>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={baixarComoImagem}
                disabled={!chavePix}
                sx={{ backgroundColor: '#00a86b', '&:hover': { backgroundColor: '#008f5a' } }}
              >
                Baixar PNG
              </Button>
              {!payload && (
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  onClick={gerarPayload}
                  disabled={!chavePix}
                >
                  Copiar Payload
                </Button>
              )}
              <Tooltip title="Copiar payload">
                <IconButton
                  onClick={copiarPayload}
                  color={copiado ? 'success' : 'primary'}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="Limpar">
                <IconButton
                  onClick={() => { setPayload(''); setErro(''); }}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QRCodePix;
