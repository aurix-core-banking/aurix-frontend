import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

export const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  resourceName 
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters || {});

  const handleFilterChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== null && value !== undefined && value !== ''
    ).length;
  };

  const getResourceFilters = () => {
    switch (resourceName) {
      case 'clientes':
        return [
          { field: 'tipoPessoa', label: 'Tipo de Pessoa', type: 'select', options: [
            { value: 'FISICA', label: 'Física' },
            { value: 'JURIDICA', label: 'Jurídica' },
          ]},
          { field: 'status', label: 'Status', type: 'select', options: [
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' },
            { value: 'BLOQUEADO', label: 'Bloqueado' },
          ]},
          { field: 'dataCadastroInicio', label: 'Data Cadastro Início', type: 'date' },
          { field: 'dataCadastroFim', label: 'Data Cadastro Fim', type: 'date' },
        ];
      
      case 'contas':
        return [
          { field: 'tipoConta', label: 'Tipo de Conta', type: 'select', options: [
            { value: 'CORRENTE', label: 'Corrente' },
            { value: 'POUPANCA', label: 'Poupança' },
            { value: 'INVESTIMENTO', label: 'Investimento' },
          ]},
          { field: 'status', label: 'Status', type: 'select', options: [
            { value: 'ATIVA', label: 'Ativa' },
            { value: 'INATIVA', label: 'Inativa' },
            { value: 'BLOQUEADA', label: 'Bloqueada' },
          ]},
          { field: 'saldoMinimo', label: 'Saldo Mínimo', type: 'number' },
          { field: 'saldoMaximo', label: 'Saldo Máximo', type: 'number' },
          { field: 'dataAberturaInicio', label: 'Data Abertura Início', type: 'date' },
          { field: 'dataAberturaFim', label: 'Data Abertura Fim', type: 'date' },
        ];
      
      case 'transacoes':
        return [
          { field: 'tipoTransacao', label: 'Tipo de Transação', type: 'select', options: [
            { value: 'DEPOSITO', label: 'Depósito' },
            { value: 'SAQUE', label: 'Saque' },
            { value: 'TRANSFERENCIA', label: 'Transferência' },
            { value: 'PAGAMENTO', label: 'Pagamento' },
            { value: 'PIX', label: 'PIX' },
          ]},
          { field: 'status', label: 'Status', type: 'select', options: [
            { value: 'PENDENTE', label: 'Pendente' },
            { value: 'PROCESSADA', label: 'Processada' },
            { value: 'CANCELADA', label: 'Cancelada' },
            { value: 'FALHADA', label: 'Falhada' },
          ]},
          { field: 'valorMinimo', label: 'Valor Mínimo', type: 'number' },
          { field: 'valorMaximo', label: 'Valor Máximo', type: 'number' },
          { field: 'dataTransacaoInicio', label: 'Data Transação Início', type: 'date' },
          { field: 'dataTransacaoFim', label: 'Data Transação Fim', type: 'date' },
        ];
      
      case 'investimentos':
        return [
          { field: 'tipoInvestimento', label: 'Tipo de Investimento', type: 'select', options: [
            { value: 'CDB', label: 'CDB' },
            { value: 'LCI', label: 'LCI' },
            { value: 'LCA', label: 'LCA' },
            { value: 'TESOURO', label: 'Tesouro Direto' },
            { value: 'FUNDO', label: 'Fundo de Investimento' },
          ]},
          { field: 'status', label: 'Status', type: 'select', options: [
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'RESGATADO', label: 'Resgatado' },
            { value: 'VENCIDO', label: 'Vencido' },
          ]},
          { field: 'rentabilidadeMinima', label: 'Rentabilidade Mínima (%)', type: 'number' },
          { field: 'rentabilidadeMaxima', label: 'Rentabilidade Máxima (%)', type: 'number' },
          { field: 'dataAplicacaoInicio', label: 'Data Aplicação Início', type: 'date' },
          { field: 'dataAplicacaoFim', label: 'Data Aplicação Fim', type: 'date' },
        ];
      
      default:
        return [];
    }
  };

  const renderFilterField = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={localFilters[filter.field] || ''}
              onChange={(e) => handleFilterChange(filter.field, e.target.value)}
              label={filter.label}
            >
              <MenuItem value="">Todos</MenuItem>
              {filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={filter.label}
            value={localFilters[filter.field] || ''}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        );
      
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label={filter.label}
              value={localFilters[filter.field] || null}
              onChange={(date) => handleFilterChange(filter.field, date)}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </LocalizationProvider>
        );
      
      default:
        return null;
    }
  };

  const resourceFilters = getResourceFilters();

  if (resourceFilters.length === 0) return null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Filtros Avançados
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                color="primary" 
                size="small" 
              />
            )}
          </Box>
        }
        action={
          <Box>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {getActiveFiltersCount() > 0 && (
              <IconButton
                onClick={handleClearFilters}
                size="small"
                color="error"
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        }
      />
      
      <Collapse in={expanded}>
        <CardContent>
          <Grid container spacing={2}>
            {resourceFilters.map((filter) => (
              <Grid item xs={12} sm={6} md={4} key={filter.field}>
                {renderFilterField(filter)}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};
