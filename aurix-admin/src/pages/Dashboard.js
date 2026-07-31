import React from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import { fetchUtils, useGetList } from 'react-admin';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { getResourceUrl } from '../config/resources';

const StatCard = ({ title, value, icon, color = '#1976d2' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box color={color} fontSize="3rem">
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Dashboard = () => {
  const { data: clientes, total: totalClientes } = useGetList('clientes', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { data: contas, total: totalContas } = useGetList('contas', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { data: transacoes, total: totalTransacoes } = useGetList('transacoes', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { data: investimentos, total: totalInvestimentos } = useGetList('investimentos', {
    pagination: { page: 1, perPage: 1 },
  });

  const [pfCount, setPfCount] = React.useState(null);
  const [pjCount, setPjCount] = React.useState(null);
  const [pfStatusCounts, setPfStatusCounts] = React.useState({});
  const [pjStatusCounts, setPjStatusCounts] = React.useState({});
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' });

    const fetchPf = fetchUtils.fetchJson(getResourceUrl('solicitacoes_conta'), { headers })
      .then(({ json }) => {
        const data = Array.isArray(json) ? json : (json.content || []);
        setPfCount(data.length);
        const counts = {};
        data.forEach(item => { counts[item.status] = (counts[item.status] || 0) + 1; });
        setPfStatusCounts(counts);
      });

    const fetchPj = fetchUtils.fetchJson(getResourceUrl('solicitacoes_pj'), { headers })
      .then(({ json }) => {
        const data = Array.isArray(json) ? json : (json.content || []);
        setPjCount(data.length);
        const counts = {};
        data.forEach(item => { counts[item.status] = (counts[item.status] || 0) + 1; });
        setPjStatusCounts(counts);
      });

    Promise.all([fetchPf, fetchPj]).finally(() => setLoadingMetrics(false));
  }, []);

  const [transacoesPorMes, setTransacoesPorMes] = React.useState([
    { mes: 'Jan', valor: 0 }, { mes: 'Fev', valor: 0 }, { mes: 'Mar', valor: 0 },
    { mes: 'Abr', valor: 0 }, { mes: 'Mai', valor: 0 }, { mes: 'Jun', valor: 0 },
  ]);

  const [tiposConta, setTiposConta] = React.useState([
    { name: 'Conta Corrente', value: 0 }, { name: 'Poupança', value: 0 }, { name: 'Investimento', value: 0 },
  ]);

  const [rendimentoInvestimentos, setRendimentoInvestimentos] = React.useState([
    { mes: 'Jan', rendimento: 0 }, { mes: 'Fev', rendimento: 0 }, { mes: 'Mar', rendimento: 0 },
    { mes: 'Abr', rendimento: 0 }, { mes: 'Mai', rendimento: 0 }, { mes: 'Jun', rendimento: 0 },
  ]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' });
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    fetchUtils.fetchJson(`${baseUrl}/dashboard/metricas`, { headers })
      .then(({ json }) => {
        if (json.transacoesPorMes) setTransacoesPorMes(json.transacoesPorMes);
        if (json.tiposConta) setTiposConta(json.tiposConta);
        if (json.rendimentoInvestimentos) setRendimentoInvestimentos(json.rendimentoInvestimentos);
      })
      .catch(() => {});
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard - Aurix Core Banking
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Clientes"
            value={totalClientes || 0}
            icon="👥"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Contas"
            value={totalContas || 0}
            icon="🏦"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Transações"
            value={totalTransacoes || 0}
            icon="💳"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Investimentos"
            value={totalInvestimentos || 0}
            icon="📈"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Onboarding
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Solicitações PF Pendentes"
            value={loadingMetrics ? '-' : ((pfStatusCounts['RECEBIDA'] || 0) + (pfStatusCounts['DOCUMENTOS_PENDENTES'] || 0) + (pfStatusCounts['EM_ANALISE_KYC'] || 0))}
            icon="📋"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Solicitações PJ Pendentes"
            value={loadingMetrics ? '-' : ((pjStatusCounts['RECEBIDA'] || 0) + (pjStatusCounts['EM_PREENCHIMENTO'] || 0) + (pjStatusCounts['CNPJ_CONSULTADO'] || 0) + (pjStatusCounts['SOCIOS_VALIDADOS'] || 0) + (pjStatusCounts['DOCUMENTOS_PENDENTES'] || 0) + (pjStatusCounts['EM_ANALISE_KYC'] || 0) + (pjStatusCounts['DOCUMENTOS_ANALISADOS'] || 0) + (pjStatusCounts['AML_APROVADO'] || 0) + (pjStatusCounts['COMPLIANCE_APROVADO'] || 0) + (pjStatusCounts['EM_ASSINATURA'] || 0) + (pjStatusCounts['CONTRATO_ASSINADO'] || 0))}
            icon="🏢"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taxa Aprovação PF"
            value={loadingMetrics ? '-' : (() => {
              const aprovadas = (pfStatusCounts['APROVADA'] || 0) + (pfStatusCounts['CONTA_CRIADA'] || 0);
              const total = pfCount - (pfStatusCounts['CANCELADA'] || 0);
              return total > 0 ? `${((aprovadas / total) * 100).toFixed(1)}%` : '0%';
            })()}
            icon="✅"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taxa Aprovação PJ"
            value={loadingMetrics ? '-' : (() => {
              const aprovadas = (pjStatusCounts['APROVADA'] || 0) + (pjStatusCounts['CONTA_CRIADA'] || 0);
              const total = pjCount - (pjStatusCounts['CANCELADA'] || 0);
              return total > 0 ? `${((aprovadas / total) * 100).toFixed(1)}%` : '0%';
            })()}
            icon="✅"
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Transações por Mês" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transacoesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Distribuição de Contas" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tiposConta}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tiposConta.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Rendimento dos Investimentos" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rendimentoInvestimentos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rendimento" stroke="#9c27b0" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Funil de Onboarding" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { status: 'Recebida', PF: pfStatusCounts['RECEBIDA'] || 0, PJ: pjStatusCounts['RECEBIDA'] || 0 },
                    { status: 'Docs Pendentes', PF: pfStatusCounts['DOCUMENTOS_PENDENTES'] || 0, PJ: pjStatusCounts['DOCUMENTOS_PENDENTES'] || 0 },
                    { status: 'Em Análise KYC', PF: pfStatusCounts['EM_ANALISE_KYC'] || 0, PJ: pjStatusCounts['EM_ANALISE_KYC'] || 0 },
                    { status: 'KYC Aprovado', PF: pfStatusCounts['KYC_APROVADO'] || 0, PJ: pjStatusCounts['KYC_APROVADO'] || 0 },
                    { status: 'Aprovada', PF: pfStatusCounts['APROVADA'] || 0, PJ: pjStatusCounts['APROVADA'] || 0 },
                    { status: 'Conta Criada', PF: pfStatusCounts['CONTA_CRIADA'] || 0, PJ: pjStatusCounts['CONTA_CRIADA'] || 0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PF" fill="#1976d2" />
                  <Bar dataKey="PJ" fill="#ed6c02" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
