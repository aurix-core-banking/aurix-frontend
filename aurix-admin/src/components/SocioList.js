import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, Typography, IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { fetchUtils } from 'react-admin';
import { getResourceUrl } from '../config/resources';

const initialForm = {
  tipo: 'SOCIO', cpf: '', nome: '', email: '',
  telefone: '', percentualParticipacao: '',
};

export const SocioList = ({ socios = [], solicitacaoId, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const url = `${getResourceUrl('solicitacoes_pj', solicitacaoId)}/socios`;
      const token = localStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }),
        body: JSON.stringify(form),
      };
      await fetchUtils.fetchJson(url, options);
      setModalOpen(false);
      setForm(initialForm);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Failed to add socio', e);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (participanteId) => {
    try {
      const url = `${getResourceUrl('solicitacoes_pj', solicitacaoId)}/socios/${participanteId}`;
      const token = localStorage.getItem('token');
      const options = {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': token ? `Bearer ${token}` : '',
        }),
      };
      await fetchUtils.fetchJson(url, options);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Failed to remove socio', e);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setModalOpen(true)}>
          Adicionar Sócio
        </Button>
      </Box>

      {socios.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum sócio cadastrado
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Participação</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {socios.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.cpf}</TableCell>
                  <TableCell>{s.tipo}</TableCell>
                  <TableCell>{s.percentualParticipacao ? `${s.percentualParticipacao}%` : '-'}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleRemove(s.id)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Sócio</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select label="Tipo" value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              {['SOCIO', 'ADMINISTRADOR', 'REPRESENTANTE', 'PROCURADOR', 'BENEFICIARIO_FINAL'].map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField label="CPF" value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              inputProps={{ maxLength: 11 }}
            />
            <TextField label="Nome" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <TextField label="Email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField label="Telefone" value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
            <TextField label="Participação (%)" type="number" value={form.percentualParticipacao}
              onChange={(e) => setForm({ ...form, percentualParticipacao: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}>
            {saving ? 'Salvando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
