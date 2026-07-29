import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccountBalance as AccountIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';

const searchOptions = [
  { type: 'cliente', label: 'Clientes', icon: PersonIcon, path: '/clientes' },
  { type: 'conta', label: 'Contas', icon: AccountIcon, path: '/contas' },
  { type: 'transacao', label: 'Transações', icon: PaymentIcon, path: '/transacoes' },
  { type: 'investimento', label: 'Investimentos', icon: TrendingIcon, path: '/investimentos' },
  { type: 'pix', label: 'PIX', icon: PaymentIcon, path: '/pix' },
  { type: 'compliance', label: 'Compliance', icon: SecurityIcon, path: '/compliance' },
  { type: 'auditoria', label: 'Auditoria', icon: SecurityIcon, path: '/auditoria' },
  { type: 'analytics', label: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
];

export const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    const search = async () => {
      try {
        const results = [];
        
        for (const option of searchOptions) {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/${option.type}?q=${encodeURIComponent(searchTerm)}&limit=3`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              results.push({
                ...option,
                results: data,
              });
            }
          }
        }
        
        setSearchResults(results);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelect = (option) => {
    navigate(option.path);
    setSearchTerm('');
    setSearchResults([]);
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option.label || '';
  };

  const renderOption = (props, option) => {
    const Icon = option.icon;
    
    return (
      <Box component="li" {...props}>
        <ListItem>
          <ListItemIcon>
            <Icon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={option.label}
            secondary={`${option.results?.length || 0} resultado(s) encontrado(s)`}
          />
        </ListItem>
      </Box>
    );
  };

  const options = searchResults.flatMap(category => 
    category.results.map(result => ({
      ...category,
      id: `${category.type}-${result.id}`,
      result,
    }))
  );

  return (
    <Box sx={{ width: 300, maxWidth: '100%' }}>
      <Autocomplete
        freeSolo
        options={options}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        loading={loading}
        value={searchTerm}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue === 'object') {
            handleSelect(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Buscar em todo o sistema..."
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <Chip label="Buscando..." size="small" /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        PaperComponent={({ children, ...other }) => (
          <Paper {...other} sx={{ maxHeight: 400, overflow: 'auto' }}>
            {children}
          </Paper>
        )}
        noOptionsText="Nenhum resultado encontrado"
        loadingText="Buscando..."
      />
    </Box>
  );
};
