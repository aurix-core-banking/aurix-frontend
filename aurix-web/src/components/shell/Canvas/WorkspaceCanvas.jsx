import React from 'react';
import { Box } from '@mui/material';

export default function WorkspaceCanvas({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {children}
    </Box>
  );
}
