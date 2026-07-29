import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export const Error = ({ error, retry, message = 'Ocorreu um erro inesperado' }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    gap={2}
    p={3}
  >
    <ErrorIcon color="error" sx={{ fontSize: 48 }} />
    <Typography variant="h6" color="error" align="center">
      {message}
    </Typography>
    {error && (
      <Typography variant="body2" color="textSecondary" align="center">
        {error.message || error.toString()}
      </Typography>
    )}
    {retry && (
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={retry}
        sx={{ mt: 2 }}
      >
        Tentar Novamente
      </Button>
    )}
  </Box>
);
