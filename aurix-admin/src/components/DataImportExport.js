import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

export const DataImportExport = ({ open, onClose, resourceName }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [exportFormat, setExportFormat] = useState('csv');
  const [importFile, setImportFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setResult(null);
  };

  const handleExport = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/${resourceName}/export?format=${exportFormat}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resourceName}_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setResult({
        type: 'success',
        message: 'Dados exportados com sucesso!',
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setLoading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/${resourceName}/import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao importar dados');
      }

      const data = await response.json();
      
      setResult({
        type: 'success',
        message: `Dados importados com sucesso! ${data.imported || 0} registros processados.`,
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message,
      });
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImportFile(file);
  };

  const getSupportedFormats = () => {
    return [
      { value: 'csv', label: 'CSV', description: 'Arquivo de texto separado por vírgulas' },
      { value: 'xlsx', label: 'Excel', description: 'Planilha do Microsoft Excel' },
      { value: 'json', label: 'JSON', description: 'Formato JavaScript Object Notation' },
    ];
  };

  const getImportFormats = () => {
    return [
      { value: 'csv', label: 'CSV', icon: FileDownloadIcon },
      { value: 'xlsx', label: 'Excel', icon: FileDownloadIcon },
    ];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Importar/Exportar Dados - {resourceName}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<DownloadIcon />} label="Exportar" />
            <Tab icon={<UploadIcon />} label="Importar" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exportar Dados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecione o formato para exportar os dados de {resourceName}.
            </Typography>

            <List>
              {getSupportedFormats().map((format) => (
                <ListItem
                  key={format.value}
                  button
                  selected={exportFormat === format.value}
                  onClick={() => setExportFormat(format.value)}
                >
                  <ListItemIcon>
                    <FileDownloadIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={format.label}
                    secondary={format.description}
                  />
                  {exportFormat === format.value && (
                    <CheckCircleIcon color="primary" />
                  )}
                </ListItem>
              ))}
            </List>

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Exportando dados...
                </Typography>
              </Box>
            )}

            {result && (
              <Alert severity={result.type} sx={{ mt: 2 }}>
                {result.message}
              </Alert>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Importar Dados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selecione um arquivo para importar dados para {resourceName}.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="import-file-input"
              />
              <label htmlFor="import-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<FileUploadIcon />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Selecionar Arquivo
                </Button>
              </label>
              
              {importFile && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={importFile.name}
                    onDelete={() => setImportFile(null)}
                    color="primary"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {(importFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Formatos suportados:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {getImportFormats().map((format) => (
                <Chip
                  key={format.value}
                  label={format.label}
                  size="small"
                  icon={<format.icon />}
                />
              ))}
            </Box>

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Importando dados...
                </Typography>
              </Box>
            )}

            {result && (
              <Alert severity={result.type} sx={{ mt: 2 }}>
                {result.message}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        {activeTab === 0 && (
          <Button
            onClick={handleExport}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={loading}
          >
            Exportar
          </Button>
        )}
        {activeTab === 1 && (
          <Button
            onClick={handleImport}
            variant="contained"
            startIcon={<UploadIcon />}
            disabled={loading || !importFile}
          >
            Importar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
