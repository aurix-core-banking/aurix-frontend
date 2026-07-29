import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { apiService } from '../../../services/apiService';

function StepSocios({ solicitacaoId, onSocioChange }) {
  const [socios, setSocios] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [socioForm, setSocioForm] = useState({ cpf: '', nome: '', email: '', telefone: '', dataNascimento: '', nacionalidade: '', qualificacao: '', percentualParticipacao: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!socioForm.cpf || !socioForm.nome) { setError('CPF e Nome são obrigatórios'); return; }
    setLoading(true);
    setError('');
    try {
      const payload = {
        tipo: 'SOCIO',
        cpf: socioForm.cpf.replace(/\D/g, ''),
        nome: socioForm.nome,
        email: socioForm.email || null,
        telefone: socioForm.telefone?.replace(/\D/g, '') || null,
        dataNascimento: socioForm.dataNascimento || null,
        nacionalidade: socioForm.nacionalidade || null,
        qualificacao: socioForm.qualificacao || null,
        percentualParticipacao: socioForm.percentualParticipacao ? Number(socioForm.percentualParticipacao) : null,
      };
      await apiService.adicionarSocioPJ(solicitacaoId, payload);
      const newList = [...socios, payload];
      setSocios(newList);
      if (onSocioChange) onSocioChange(newList.length);
      setDialogOpen(false);
      setSocioForm({ cpf: '', nome: '', email: '', telefone: '', dataNascimento: '', nacionalidade: '', qualificacao: '', percentualParticipacao: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao adicionar sócio');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (idx, cpf) => {
    setError('');
    const socio = socios[idx];
    if (socio.id) {
      try { await apiService.removerSocioPJ(solicitacaoId, socio.id); } catch {}
    }
    const filtered = socios.filter((_, i) => i !== idx);
    setSocios(filtered);
    if (onSocioChange) onSocioChange(filtered.length);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Sócios</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="outlined" startIcon={<Add />} onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
        Adicionar sócio
      </Button>
      {socios.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Participação</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {socios.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.cpf}</TableCell>
                  <TableCell>{s.percentualParticipacao ? `${s.percentualParticipacao}%` : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleRemove(i, s.cpf)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {socios.length === 0 && <Typography variant="body2" color="text.secondary">Nenhum sócio adicionado</Typography>}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar sócio</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="CPF" value={socioForm.cpf} onChange={(e) => setSocioForm({ ...socioForm, cpf: e.target.value.replace(/\D/g, '').substr(0, 11) })} margin="dense" required />
          <TextField fullWidth label="Nome" value={socioForm.nome} onChange={(e) => setSocioForm({ ...socioForm, nome: e.target.value })} margin="dense" required />
          <TextField fullWidth label="E-mail" value={socioForm.email} onChange={(e) => setSocioForm({ ...socioForm, email: e.target.value })} margin="dense" />
          <TextField fullWidth label="Telefone" value={socioForm.telefone} onChange={(e) => setSocioForm({ ...socioForm, telefone: e.target.value.replace(/\D/g, '').substr(0, 11) })} margin="dense" />
          <TextField fullWidth label="Data de nascimento" type="date" value={socioForm.dataNascimento} onChange={(e) => setSocioForm({ ...socioForm, dataNascimento: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField fullWidth label="Nacionalidade" value={socioForm.nacionalidade} onChange={(e) => setSocioForm({ ...socioForm, nacionalidade: e.target.value })} margin="dense" />
          <TextField fullWidth label="Qualificação" value={socioForm.qualificacao} onChange={(e) => setSocioForm({ ...socioForm, qualificacao: e.target.value })} margin="dense" />
          <TextField fullWidth label="% Participação" type="number" value={socioForm.percentualParticipacao} onChange={(e) => setSocioForm({ ...socioForm, percentualParticipacao: e.target.value })} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdd} variant="contained" disabled={loading}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StepSocios;
