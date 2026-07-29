import React from 'react';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import SuiteHeader from './Header/SuiteHeader';
import ContextSidebar from './Navigation/ContextSidebar';
import WorkspaceTabs from './Navigation/WorkspaceTabs';
import WorkspaceCanvas from './Canvas/WorkspaceCanvas';
import { ShellProvider } from '../../context/ShellContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#090D16',
      paper: '#111827',
    },
    primary: {
      main: '#D4AF37', // AUREUS Gold
    },
  },
});

const UnifiedShell = ({ user, onLogout, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ShellProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
          <SuiteHeader user={user} onLogout={onLogout} />
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <ContextSidebar />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              <WorkspaceTabs />
              <WorkspaceCanvas>
                {children}
              </WorkspaceCanvas>
            </Box>
          </Box>
        </Box>
      </ShellProvider>
    </ThemeProvider>
  );
};

export default UnifiedShell;
