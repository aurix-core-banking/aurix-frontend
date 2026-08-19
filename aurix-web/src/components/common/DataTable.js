import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  Typography,
  Skeleton,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search, Inbox } from '@mui/icons-material';

const DirecaoOrdenacao = {
  asc: 'asc',
  desc: 'desc',
};

const TabelaDados = ({
  colunas = [],
  dados = [],
  carregando = false,
  titulo,
  ordenavel = true,
  filtrosInline = true,
  campoChave = 'id',
  textoVazio = 'Nenhum registro encontrado',
  onOrdernar,
  orderCampo,
  orderDirecao,
}) => {
  const [campoFiltro, setCampoFiltro] = useState('');
  const [colunaOrdenacao, setColunaOrdenacao] = useState(orderCampo || '');
  const [direcao, setDirecao] = useState(orderDirecao || DirecaoOrdenacao.asc);

  const dadosFiltrados = useMemo(() => {
    if (!campoFiltro) return dados;
    const termo = campoFiltro.toLowerCase();
    return dados.filter((item) =>
      colunas.some((col) => {
        const valor = col.campo ? item[col.campo] : '';
        return String(valor || '').toLowerCase().includes(termo);
      })
    );
  }, [dados, campoFiltro, colunas]);

  const dadosOrdenados = useMemo(() => {
    if (!colunaOrdenacao) return dadosFiltrados;
    return [...dadosFiltrados].sort((a, b) => {
      const valorA = a[colunaOrdenacao] || '';
      const valorB = b[colunaOrdenacao] || '';
      const comparacao = String(valorA).localeCompare(String(valorB), 'pt-BR', {
        numeric: true,
      });
      return direcao === DirecaoOrdenacao.asc ? comparacao : -comparacao;
    });
  }, [dadosFiltrados, colunaOrdenacao, direcao]);

  const handleSolicitarOrdenacao = (campo) => {
    if (!ordenavel) return;
    const ehMesmaColuna = colunaOrdenacao === campo;
    const novaDirecao = ehMesmaColuna && direcao === DirecaoOrdenacao.asc
      ? DirecaoOrdenacao.desc
      : DirecaoOrdenacao.asc;
    setColunaOrdenacao(campo);
    setDirecao(novaDirecao);
    if (onOrdernar) {
      onOrdernar(campo, novaDirecao);
    }
  };

  if (carregando) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {titulo && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">{titulo}</Typography>
          </Box>
        )}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {colunas.map((col) => (
                  <TableCell key={col.id || col.campo} sx={{ fontWeight: 'bold' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {colunas.map((col) => (
                    <TableCell key={col.id || col.campo}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {(titulo || filtrosInline) && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {titulo && (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {titulo}
            </Typography>
          )}
          {filtrosInline && (
            <TextField
              size="small"
              placeholder="Filtrar..."
              value={campoFiltro}
              onChange={(e) => setCampoFiltro(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          )}
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {colunas.map((col) => (
                <TableCell
                  key={col.id || col.campo}
                  sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                  align={col.alinhamento || 'left'}
                >
                  {ordenavel && col.ordenavel !== false && col.campo ? (
                    <TableSortLabel
                      active={colunaOrdenacao === col.campo}
                      direction={colunaOrdenacao === col.campo ? direcao : 'asc'}
                      onClick={() => handleSolicitarOrdenacao(col.campo)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dadosOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colunas.length}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 6,
                      color: 'text.secondary',
                    }}
                  >
                    <Inbox sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body1">{textoVazio}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              dadosOrdenados.map((item) => (
                <TableRow
                  key={item[campoChave]}
                  hover
                  sx={{ cursor: item.onClick ? 'pointer' : 'default' }}
                  onClick={item.onClick}
                >
                  {colunas.map((col) => (
                    <TableCell key={col.id || col.campo} align={col.alinhamento || 'left'}>
                      {col.render
                        ? col.render(item)
                        : col.campo
                        ? item[col.campo]
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TabelaDados;
