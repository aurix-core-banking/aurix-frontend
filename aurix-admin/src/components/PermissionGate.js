import React from 'react';
import { usePermissions } from 'react-admin';
import { Alert, Box } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

export const PermissionGate = ({ 
  children, 
  permission, 
  fallback = null,
  showError = true 
}) => {
  const { permissions } = usePermissions();

  const hasPermission = () => {
    if (!permission) return true;
    if (!permissions) return false;
    
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.includes(p));
    }
    
    return permissions.includes(permission);
  };

  if (!hasPermission()) {
    if (fallback) {
      return fallback;
    }

    if (showError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            p: 3,
          }}
        >
          <LockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Alert severity="warning" sx={{ maxWidth: 400 }}>
            Você não tem permissão para acessar esta funcionalidade.
          </Alert>
        </Box>
      );
    }

    return null;
  }

  return children;
};

export const usePermission = (permission) => {
  const { permissions } = usePermissions();
  
  if (!permission) return true;
  if (!permissions) return false;
  
  if (Array.isArray(permission)) {
    return permission.some(p => permissions.includes(p));
  }
  
  return permissions.includes(permission);
};
