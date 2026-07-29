import React, { useState } from 'react';
import { TextField, Alert } from '@mui/material';
import { apiService } from '../../../services/apiService';

const formatCNPJ = (value) => value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substr(0, 18);

function StepEmpresa({ form, setForm, error, solicitacaoId }) {
  const [loading, setLoading] = useState(false);

  const handleCnpjBlur = async () => {
    const cnpjDigits = form.cnpj?.replace(/\D/g, '');
    if (!cnpjDigits || cnpjDigits.length !== 14) return;
    if (!solicitacaoId) return;
    try {
      setLoading(true);
      const data = await apiService.validarCNPJPJ(solicitacaoId);
      if (data) {
        setForm({
          ...form,
          razaoSocial: data.razaoSocial || form.razaoSocial,
          nomeFantasia: data.nomeFantasia || form.nomeFantasia,
        });
      }
    } catch (e) {
      // Allow manual entry
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField fullWidth label="CNPJ" value={form.cnpj || ''} onChange={(e) => setForm({ ...form, cnpj: formatCNPJ(e.target.value) })} onBlur={handleCnpjBlur} disabled={loading} margin="normal" required />
      <TextField fullWidth label="Razão Social" value={form.razaoSocial || ''} onChange={handleChange('razaoSocial')} margin="normal" required />
      <TextField fullWidth label="Nome Fantasia" value={form.nomeFantasia || ''} onChange={handleChange('nomeFantasia')} margin="normal" />
      <TextField fullWidth label="E-mail" type="email" value={form.email || ''} onChange={handleChange('email')} margin="normal" required />
      <TextField fullWidth label="Telefone" value={form.telefone || ''} onChange={(e) => setForm({ ...form, telefone: e.target.value.replace(/\D/g, '').substr(0, 11) })} margin="normal" />
      <TextField fullWidth label="Endereço" value={form.endereco || ''} onChange={handleChange('endereco')} margin="normal" multiline rows={2} />
    </>
  );
}

export default StepEmpresa;
