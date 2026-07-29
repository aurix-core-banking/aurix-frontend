import React from 'react';
import { Layout as ReactAdminLayout, AppBar, TitlePortal, UserMenu, useGetIdentity } from 'react-admin';
import { MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { GlobalSearch } from './GlobalSearch';
import { ThemeToggle } from './ThemeToggle';

const CustomUserMenu = () => {
  const { data: identity } = useGetIdentity();
  
  return (
    <UserMenu>
      <MenuItem>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {identity?.name || 'Usuário'}
        </ListItemText>
      </MenuItem>
    </UserMenu>
  );
};

const CustomAppBar = () => (
  <AppBar userMenu={<CustomUserMenu />}>
    <TitlePortal />
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
      <GlobalSearch />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ThemeToggle />
    </Box>
  </AppBar>
);

export const Layout = (props) => (
  <ReactAdminLayout {...props} appBar={CustomAppBar} />
);
