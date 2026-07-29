import React, { useState } from 'react';
import { Drawer, IconButton, Grid, Typography, Box, ButtonBase } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import { useShell } from '../../../context/ShellContext';

const apps = [
  'AUREUS Banking',
  'AUREUS Admin',
  'Investimentos',
  'Crédito',
  'Fraude & Compliance',
  'Configurações'
];

export default function AppLauncher() {
  const [open, setOpen] = useState(false);
  const { switchApp } = useShell();

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={() => setOpen(true)} 
        aria-label="App Launcher"
      >
        <AppsIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            AUREUS Suite
          </Typography>
          <Grid container spacing={2}>
            {apps.map((app) => (
              <Grid item xs={6} key={app}>
                <ButtonBase
                  onClick={() => {
                    switchApp(app);
                    setOpen(false);
                  }}
                  sx={{
                    width: '100%',
                    height: 100,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    p: 1
                  }}
                >
                  <Typography variant="body2" align="center">{app}</Typography>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}
