import React from 'react';
import {
  Box,
  TablePagination as MuiTablePagination,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

const TamanhosPagina = [10, 25, 50, 100];

const Paginacao = ({
  pagina = 0,
  tamanhoPagina = 10,
  totalRegistros = 0,
  onMudarPagina,
  onMudarTamanhoPagina,
}) => {
  const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

  const handleChangePage = (_event, novaPagina) => {
    if (onMudarPagina) {
      onMudarPagina(novaPagina);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const novoTamanho = parseInt(event.target.value, 10);
    if (onMudarTamanhoPagina) {
      onMudarTamanhoPagina(novoTamanho);
    }
    if (onMudarPagina) {
      onMudarPagina(0);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {totalRegistros} registro{totalRegistros !== 1 ? 's' : ''}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Itens</InputLabel>
          <Select
            value={tamanhoPagina}
            label="Itens"
            onChange={handleChangeRowsPerPage}
          >
            {TamanhosPagina.map((tamanho) => (
              <MenuItem key={tamanho} value={tamanho}>
                {tamanho}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <MuiTablePagination
        component="div"
        count={totalRegistros}
        page={pagina}
        onPageChange={handleChangePage}
        rowsPerPage={tamanhoPagina}
        rowsPerPageOptions={TamanhosPagina}
        labelRowsPerPage="Itens por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </Box>
  );
};

export default Paginacao;
