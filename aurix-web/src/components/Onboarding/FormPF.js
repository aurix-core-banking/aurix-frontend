import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { apiService } from '../../services/apiService';

const formatCPF = (value) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substr(0, 14);

const formatTelefone = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substr(0, 15);

function FormPF({ onComplete }) {
  const [form, setForm] = useState({ cpf: '', nome: '', email: '', telefone: '', dataNascimento: '', ocupacao: '', rendaDeclarada: '', endereco: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cpf || !form.nome || !form.email) {
      setError('CPF, Nome e E-mail são obrigatórios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        cpf: form.cpf.replace(/\D/g, ''),
        nome: form.nome,
        email: form.email,
        telefone: form.telefone.replace(/\D/g, ''),
        dataNascimento: form.dataNascimento || null,
        ocupacao: form.ocupacao || null,
        rendaDeclarada: form.rendaDeclarada ? Number(form.rendaDeclarada) : null,
        endereco: form.endereco || null,
      };
      const res = await apiService.criarSolicitacaoPF(payload);
      onComplete(res.data.id);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Abertura de conta PF</Typography>
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit} data-testid="pf-form">
            <TextField fullWidth label="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })} margin="normal" required />
            <TextField fullWidth label="Nome completo" value={form.nome} onChange={handleChange('nome')} margin="normal" required />
            <TextField fullWidth label="E-mail" type="email" value={form.email} onChange={handleChange('email')} margin="normal" required />
            <TextField fullWidth label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: formatTelefone(e.target.value) })} margin="normal" />
            <TextField fullWidth label="Data de nascimento" type="date" value={form.dataNascimento} onChange={handleChange('dataNascimento')} margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Ocupação" value={form.ocupacao} onChange={handleChange('ocupacao')} margin="normal" />
            <TextField fullWidth label="Renda declarada (R$)" type="number" value={form.rendaDeclarada} onChange={handleChange('rendaDeclarada')} margin="normal" />
            <TextField fullWidth label="Endereço" value={form.endereco} onChange={handleChange('endereco')} margin="normal" multiline rows={2} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading}>Solicitar abertura</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FormPF;
