import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useShell } from '../../../context/ShellContext';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const NAV_CONFIG = {
  banking: [
    { label: 'Inicio', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Contas & Saldos', path: '/contas', icon: <AccountBalanceWalletIcon /> },
    { label: 'Extrato Bancário', path: '/extrato', icon: <ReceiptIcon /> },
    { label: 'Área Pix', path: '/pix', icon: <QrCodeIcon /> },
    { label: 'Cartões', path: '/cartoes', icon: <CreditCardIcon /> },
    { label: 'Investimentos', path: '/investimentos', icon: <TrendingUpIcon /> },
  ],
  admin: [
    { label: 'Visão Geral Admin', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Gestão de Clientes', path: '/contas', icon: <PeopleIcon /> },
    { label: 'Auditoria de Transações', path: '/transacoes', icon: <SecurityIcon /> },
  ],
  settings: [
    { label: 'Perfil', path: '/perfil', icon: <PersonIcon /> },
    { label: 'Configurações', path: '/configuracoes', icon: <SettingsIcon /> },
  ]
};

const DRAWER_WIDTH = 240;
const COMPACT_WIDTH = 64;

export default function ContextSidebar() {
  const { activeApp, sidebarCollapsed } = useShell();

  const navItems = NAV_CONFIG[activeApp] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarCollapsed ? COMPACT_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: sidebarCollapsed ? COMPACT_WIDTH : DRAWER_WIDTH, 
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.2s',
        },
      }}
    >
      <Box sx={{ overflow: 'hidden' }}>
        <List>
          {navItems.map((item, index) => (
            <ListItem 
              button 
              key={index} 
              component={Link} 
              to={item.path}
              sx={{ 
                minHeight: 48,
                justifyContent: sidebarCollapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarCollapsed ? 0 : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ opacity: sidebarCollapsed ? 0 : 1 }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
