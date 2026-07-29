import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  SwapHoriz,
  Payment,
  TrendingUp,
  CreditCard,
  Person,
  Settings,
  Security,
  Assessment,
  Receipt,
  Business,
  PhoneAndroid,
  ArrowForward,
  ReceiptLong
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      description: 'Visão geral da conta'
    },
    {
      title: 'Contas',
      icon: <AccountBalance />,
      path: '/contas',
      description: 'Gerenciar contas'
    },
    {
      title: 'Transações',
      icon: <SwapHoriz />,
      path: '/transacoes',
      description: 'Histórico de transações'
    },
    {
      title: 'PIX',
      icon: <Payment />,
      path: '/pix',
      description: 'Transferências PIX'
    },
    {
      title: 'Investimentos',
      icon: <TrendingUp />,
      path: '/investimentos',
      description: 'Aplicações financeiras'
    },
    {
      title: 'Cartões',
      icon: <CreditCard />,
      path: '/cartoes',
      description: 'Cartões de crédito'
    },
    {
      title: 'Abertura de conta',
      icon: <Business />,
      path: '/onboarding',
      description: 'Solicitar abertura'
    },
    {
      title: 'Crédito',
      icon: <Assessment />,
      path: '/credito',
      description: 'Simular e solicitar'
    },
    {
      title: 'Perfil',
      icon: <Person />,
      path: '/perfil',
      description: 'Dados pessoais'
    },
    {
      title: 'Configurações',
      icon: <Settings />,
      path: '/configuracoes',
      description: 'Configurações da conta'
    },
    {
      title: 'Extrato',
      icon: <Receipt />,
      path: '/extrato',
      description: 'Extrato bancário'
    },
    {
      title: 'Transferência',
      icon: <ArrowForward />,
      path: '/transferencia',
      description: 'Transferências'
    },
    {
      title: 'Pagamento',
      icon: <ReceiptLong />,
      path: '/pagamento',
      description: 'Pagamentos'
    },
    {
      title: 'Recarga',
      icon: <PhoneAndroid />,
      path: '/recarga',
      description: 'Recarga de celular'
    }
  ];

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          AUREUS Banking
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Internet Banking
        </Typography>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={item.description}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: isActive(item.path) ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Segurança
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleItemClick('/security')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Security fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Segurança"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleItemClick('/audit')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Assessment fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Auditoria"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleItemClick('/compliance')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Receipt fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Compliance"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleItemClick('/organization')}
              sx={{ borderRadius: 1, py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Business fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Organização"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          AUREUS Platform v1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          © 2024 AUREUS Core Banking
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
