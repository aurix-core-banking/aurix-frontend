import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Person, Business } from '@mui/icons-material';

function TipoSelector({ onSelect }) {
  const options = [
    { tipo: 'PF', icon: <Person sx={{ fontSize: 48 }} />, title: 'Pessoa Física', desc: 'Conta pessoal' },
    { tipo: 'PJ', icon: <Business sx={{ fontSize: 48 }} />, title: 'Pessoa Jurídica', desc: 'Conta empresarial' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Abertura de conta</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecione o tipo de conta que deseja abrir
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <Card
            key={opt.tipo}
            sx={{
              flex: '1 1 280px', cursor: 'pointer', transition: '0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
            onClick={() => onSelect(opt.tipo)}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              {opt.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>{opt.title}</Typography>
              <Typography variant="body2" color="text.secondary">{opt.desc}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default TipoSelector;
