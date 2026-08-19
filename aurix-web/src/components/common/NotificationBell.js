import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  Circle,
  CheckCircle,
  AttachMoney,
  Security,
  Warning,
  Info,
  MarkEmailRead,
} from '@mui/icons-material';

const tipoParaIcone = (tipo) => {
  switch (tipo) {
    case 'TRANSACAO': return <AttachMoney fontSize="small" />;
    case 'SEGURANCA': return <Security fontSize="small" />;
    case 'ALERTA': return <Warning fontSize="small" />;
    case 'SISTEMA': return <Info fontSize="small" />;
    default: return <Circle fontSize="small" />;
  }
};

const tipoParaCor = (tipo) => {
  switch (tipo) {
    case 'TRANSACAO': return 'primary';
    case 'SEGURANCA': return 'warning';
    case 'ALERTA': return 'error';
    case 'SISTEMA': return 'info';
    default: return 'default';
  }
};

const SinoNotificacoes = ({
  notificacoes = [],
  carregando = false,
  onMarcarLida,
  onMarcarTodasLidas,
  onNotificacaoClick,
  maxItens = 10,
}) => {
  const [ancora, setAncora] = useState(null);
  const aberto = Boolean(ancora);
  const referencia = useRef(null);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const handleAbrir = (event) => {
    setAncora(event.currentTarget);
  };

  const handleFechar = () => {
    setAncora(null);
  };

  const handleMarcarLida = useCallback((event, notificacao) => {
    event.stopPropagation();
    if (onMarcarLida) {
      onMarcarLida(notificacao.id);
    }
  }, [onMarcarLida]);

  const handleClicarNotificacao = useCallback((notificacao) => {
    if (onNotificacaoClick) {
      onNotificacaoClick(notificacao);
    }
    if (!notificacao.lida && onMarcarLida) {
      onMarcarLida(notificacao.id);
    }
    handleFechar();
  }, [onNotificacaoClick, onMarcarLida]);

  const formatarTempo = (data) => {
    if (!data) return '';
    const agora = new Date();
    const dataNotif = new Date(data);
    const diffMs = agora - dataNotif;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHora = Math.floor(diffMin / 60);
    const diffDia = Math.floor(diffHora / 24);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min`;
    if (diffHora < 24) return `${diffHora}h`;
    return `${diffDia}d`;
  };

  const itensVisiveis = notificacoes.slice(0, maxItens);

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          ref={referencia}
          color="inherit"
          onClick={handleAbrir}
          aria-label="notificações"
        >
          <Badge badgeContent={naoLidas} color="error" max={99}>
            {naoLidas > 0 ? <Notifications /> : <NotificationsNone />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={ancora}
        open={aberto}
        onClose={handleFechar}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 480,
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Notificações
          </Typography>
          {naoLidas > 0 && (
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={() => {
                if (onMarcarTodasLidas) onMarcarTodasLidas();
              }}
            >
              Marcar todas como lidas
            </Button>
          )}
        </Box>
        <Divider />

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {carregando ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <MenuItem key={idx} disabled>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="90%" />
                </Box>
              </MenuItem>
            ))
          ) : itensVisiveis.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              <NotificationsNone sx={{ fontSize: 48, mb: 1 }} />
              <Typography>Nenhuma notificação</Typography>
            </Box>
          ) : (
            itensVisiveis.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => handleClicarNotificacao(notif)}
                sx={{
                  py: 1.5,
                  backgroundColor: notif.lida ? 'transparent' : 'action.hover',
                  borderLeft: notif.lida ? '3px solid transparent' : '3px solid',
                  borderLeftColor: `${tipoParaCor(notif.tipo)}.main`,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {notif.lida ? (
                    <CheckCircle fontSize="small" color="success" />
                  ) : (
                    tipoParaIcone(notif.tipo)
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: notif.lida ? 'normal' : 'bold' }}
                      >
                        {notif.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatarTempo(notif.data)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {notif.mensagem}
                    </Typography>
                  }
                />
                {!notif.lida && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMarcarLida(e, notif)}
                    title="Marcar como lida"
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                )}
              </MenuItem>
            ))
          )}
        </Box>

        {notificacoes.length > maxItens && (
          <>
            <Divider />
            <Box sx={{ py: 1, textAlign: 'center' }}>
              <Button size="small" onClick={handleFechar}>
                Ver todas ({notificacoes.length})
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default SinoNotificacoes;
