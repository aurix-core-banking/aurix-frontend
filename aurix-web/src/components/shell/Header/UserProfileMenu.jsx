import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useShell } from '../../../context/ShellContext';

export default function UserProfileMenu({ anchorEl, open, onClose, user, onLogout }) {
  const { themeMode, toggleTheme } = useShell();

  const handleLogoutClick = () => {
    if (onClose) onClose();
    if (onLogout) onLogout();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    if (onClose) onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(open)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: {
          minWidth: 200,
          background: 'background.paper',
          mt: 1,
        }
      }}
    >
      <Box px={2} py={1}>
        <Typography variant="subtitle2" fontWeight="bold">
          {user?.nome || 'Usuário AUREUS'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email || 'usuario@aurix.com.br'}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleThemeToggle}>
        <ListItemIcon>
          {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText primary={themeMode === 'dark' ? 'Modo Claro' : 'Modo Escuro'} />
      </MenuItem>
      <MenuItem onClick={handleLogoutClick} data-testid="logout-menu-item">
        <ListItemIcon sx={{ color: 'error.main' }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Sair da Conta" sx={{ color: 'error.main' }} />
      </MenuItem>
    </Menu>
  );
}
