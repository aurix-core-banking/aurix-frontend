import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

export const BulkActions = ({ 
  selectedIds, 
  onBulkDelete, 
  onBulkEdit, 
  onBulkExport, 
  onBulkImport,
  onBulkStatusChange,
  resourceName 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('');
  const [dialogData, setDialogData] = React.useState({});

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (type, data = {}) => {
    setDialogType(type);
    setDialogData(data);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
    setDialogData({});
  };

  const handleConfirm = () => {
    switch (dialogType) {
      case 'delete':
        onBulkDelete(selectedIds);
        break;
      case 'edit':
        onBulkEdit(selectedIds, dialogData);
        break;
      case 'export':
        onBulkExport(selectedIds);
        break;
      case 'import':
        onBulkImport(dialogData.file);
        break;
      case 'status':
        onBulkStatusChange(selectedIds, dialogData.status);
        break;
      default:
        break;
    }
    handleDialogClose();
  };

  const getStatusOptions = () => {
    switch (resourceName) {
      case 'clientes':
        return [
          { value: 'ATIVO', label: 'Ativo' },
          { value: 'INATIVO', label: 'Inativo' },
          { value: 'BLOQUEADO', label: 'Bloqueado' },
        ];
      case 'contas':
        return [
          { value: 'ATIVA', label: 'Ativa' },
          { value: 'INATIVA', label: 'Inativa' },
          { value: 'BLOQUEADA', label: 'Bloqueada' },
        ];
      case 'transacoes':
        return [
          { value: 'PENDENTE', label: 'Pendente' },
          { value: 'PROCESSADA', label: 'Processada' },
          { value: 'CANCELADA', label: 'Cancelada' },
        ];
      default:
        return [];
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip 
          label={`${selectedIds.length} item(s) selecionado(s)`} 
          color="primary" 
          size="small" 
        />
        <Button
          size="small"
          startIcon={<MoreVertIcon />}
          onClick={handleMenuOpen}
        >
          Ações em Lote
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDialogOpen('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir Selecionados</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleDialogOpen('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar em Lote</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleDialogOpen('export')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar Selecionados</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleDialogOpen('import')}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Importar Dados</ListItemText>
        </MenuItem>
        
        {getStatusOptions().length > 0 && (
          <MenuItem onClick={() => handleDialogOpen('status')}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Alterar Status</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'delete' && 'Confirmar Exclusão'}
          {dialogType === 'edit' && 'Edição em Lote'}
          {dialogType === 'export' && 'Exportar Dados'}
          {dialogType === 'import' && 'Importar Dados'}
          {dialogType === 'status' && 'Alterar Status'}
        </DialogTitle>
        
        <DialogContent>
          {dialogType === 'delete' && (
            <Box>
              <p>Tem certeza que deseja excluir {selectedIds.length} item(s) selecionado(s)?</p>
              <p>Esta ação não pode ser desfeita.</p>
            </Box>
          )}
          
          {dialogType === 'edit' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Campo para editar"
                value={dialogData.field || ''}
                onChange={(e) => setDialogData({ ...dialogData, field: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Novo valor"
                value={dialogData.value || ''}
                onChange={(e) => setDialogData({ ...dialogData, value: e.target.value })}
              />
            </Box>
          )}
          
          {dialogType === 'export' && (
            <Box>
              <p>Exportar {selectedIds.length} item(s) selecionado(s) para:</p>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" sx={{ mr: 1 }}>CSV</Button>
                <Button variant="outlined" sx={{ mr: 1 }}>Excel</Button>
                <Button variant="outlined">PDF</Button>
              </Box>
            </Box>
          )}
          
          {dialogType === 'import' && (
            <Box>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setDialogData({ ...dialogData, file: e.target.files[0] })}
              />
            </Box>
          )}
          
          {dialogType === 'status' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                select
                label="Novo Status"
                value={dialogData.status || ''}
                onChange={(e) => setDialogData({ ...dialogData, status: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Selecione um status</option>
                {getStatusOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
