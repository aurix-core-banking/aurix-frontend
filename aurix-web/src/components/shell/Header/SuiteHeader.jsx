import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Badge, Avatar, Box, Chip } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { useShell } from '../../../context/ShellContext';
import UserProfileMenu from './UserProfileMenu';

const SuiteHeader = ({ user, onLogout }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { 
    activeApp, 
    toggleSidebar, 
    setCommandPaletteOpen,
    setNotificationDrawerOpen
  } = useShell();


  // Simple mapping for display purposes
  const getAppDisplayName = (appId) => {
    switch (appId) {
      case 'banking': return 'AUREUS Banking';
      case 'admin': return 'AUREUS Admin';
      default: return 'AUREUS Banking';
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="apps">
          <AppsIcon />
        </IconButton>
        
        <IconButton 
          color="inherit" 
          aria-label="menu" 
          onClick={toggleSidebar}
          data-testid="menu-toggle-btn"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          AUREUS Suite
          <Chip 
            label={getAppDisplayName(activeApp)} 
            size="small" 
            color="primary" 
            sx={{ ml: 2, fontWeight: 'bold' }} 
          />
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button 
          variant="outlined" 
          startIcon={<SearchIcon />}
          onClick={() => setCommandPaletteOpen(true)}
          sx={{ 
            color: 'text.secondary', 
            borderColor: 'divider',
            justifyContent: 'flex-start',
            width: '250px',
            textTransform: 'none',
            mr: 2
          }}
        >
          Buscar comando (Ctrl+K)...
        </Button>

        <IconButton 
          color="inherit" 
          onClick={() => setNotificationDrawerOpen(true)}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton 
          aria-label="user-profile"
          onClick={(e) => setUserMenuAnchor(e.currentTarget)} 
          sx={{ ml: 1 }}
        >
          <Avatar alt="User Profile" sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'white' }}>
            {user?.nome ? user.nome[0] : 'U'}
          </Avatar>
        </IconButton>

        <UserProfileMenu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          user={user}
          onLogout={onLogout}
        />
      </Toolbar>
    </AppBar>
  );
};


export default SuiteHeader;
