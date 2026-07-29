import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/Layout';
import { authProvider } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { theme } from './theme';
import { i18nProvider } from './providers/i18nProvider';

import { Login } from './pages/Login';
import { ClienteList, ClienteEdit, ClienteCreate, ClienteShow } from './pages/Clientes';
import { ContaList, ContaEdit, ContaCreate, ContaShow } from './pages/Contas';
import { TransacaoList, TransacaoEdit, TransacaoCreate, TransacaoShow } from './pages/Transacoes';
import { InvestimentoList, InvestimentoEdit, InvestimentoCreate, InvestimentoShow } from './pages/Investimentos';
import { PIXList, PIXEdit, PIXCreate, PIXShow } from './pages/PIX';
import { ComplianceList, ComplianceEdit, ComplianceCreate, ComplianceShow } from './pages/Compliance';
import { AuditoriaList, AuditoriaShow } from './pages/Auditoria';
import { AnalyticsList, AnalyticsShow } from './pages/Analytics';
import { InstituicaoList, InstituicaoShow, InstituicaoCreate, InstituicaoEdit } from './pages/Instituicoes';
import { PlanoList, PlanoShow } from './pages/Planos';
import { SolicitacaoContaList, SolicitacaoContaShow } from './pages/SolicitacoesConta';
import { SolicitacaoPJList, SolicitacaoPJShow } from './pages/SolicitacoesPJ';
import { ProdutoCreditoList, ProdutoCreditoShow } from './pages/ProdutosCredito';
import { SolicitacaoCreditoList, SolicitacaoCreditoShow } from './pages/SolicitacoesCredito';
import { ParceiroList, ParceiroShow } from './pages/Parceiros';
import { RelatorioBacenList, RelatorioBacenShow } from './pages/RelatoriosBacen';
import { EmpresaList, EmpresaShow } from './pages/Empresas';
import { FuncionarioList, FuncionarioShow } from './pages/Funcionarios';

const App = () => (
  <Admin
    title="Aurix Core Banking"
    dashboard={Dashboard}
    layout={Layout}
    authProvider={authProvider}
    dataProvider={dataProvider}
    theme={theme}
    i18nProvider={i18nProvider}
    loginPage={Login}
  >
    <Resource
      name="clientes"
      list={ClienteList}
      edit={ClienteEdit}
      create={ClienteCreate}
      show={ClienteShow}
      options={{ label: 'Clientes' }}
    />
    <Resource
      name="contas"
      list={ContaList}
      edit={ContaEdit}
      create={ContaCreate}
      show={ContaShow}
      options={{ label: 'Contas' }}
    />
    <Resource
      name="transacoes"
      list={TransacaoList}
      edit={TransacaoEdit}
      create={TransacaoCreate}
      show={TransacaoShow}
      options={{ label: 'Transações' }}
    />
    <Resource
      name="investimentos"
      list={InvestimentoList}
      edit={InvestimentoEdit}
      create={InvestimentoCreate}
      show={InvestimentoShow}
      options={{ label: 'Investimentos' }}
    />
    <Resource
      name="pix"
      list={PIXList}
      edit={PIXEdit}
      create={PIXCreate}
      show={PIXShow}
      options={{ label: 'PIX' }}
    />
    <Resource
      name="compliance"
      list={ComplianceList}
      edit={ComplianceEdit}
      create={ComplianceCreate}
      show={ComplianceShow}
      options={{ label: 'Compliance' }}
    />
    <Resource
      name="auditoria"
      list={AuditoriaList}
      show={AuditoriaShow}
      options={{ label: 'Auditoria' }}
    />
    <Resource
      name="analytics"
      list={AnalyticsList}
      show={AnalyticsShow}
      options={{ label: 'Analytics' }}
    />
    <Resource
      name="instituicoes"
      list={InstituicaoList}
      show={InstituicaoShow}
      create={InstituicaoCreate}
      edit={InstituicaoEdit}
      options={{ label: 'Instituicoes (Provisioning)' }}
    />
    <Resource
      name="planos"
      list={PlanoList}
      show={PlanoShow}
      options={{ label: 'Planos (Billing)' }}
    />
    <Resource
      name="solicitacoes_conta"
      list={SolicitacaoContaList}
      show={SolicitacaoContaShow}
      options={{ label: 'Onboarding - Solicitacoes' }}
    />
    <Resource
      name="solicitacoes_pj"
      list={SolicitacaoPJList}
      show={SolicitacaoPJShow}
      options={{ label: 'Onboarding - PJ' }}
    />
    <Resource
      name="produtos_credito"
      list={ProdutoCreditoList}
      show={ProdutoCreditoShow}
      options={{ label: 'Produtos Credito' }}
    />
    <Resource
      name="solicitacoes_credito"
      list={SolicitacaoCreditoList}
      show={SolicitacaoCreditoShow}
      options={{ label: 'Solicitacoes Credito' }}
    />
    <Resource
      name="parceiros"
      list={ParceiroList}
      show={ParceiroShow}
      options={{ label: 'Parceiros (BaaS)' }}
    />
    <Resource
      name="relatorios_bacen"
      list={RelatorioBacenList}
      show={RelatorioBacenShow}
      options={{ label: 'Relatorios BACEN' }}
    />
    <Resource
      name="empresas"
      list={EmpresaList}
      show={EmpresaShow}
      options={{ label: 'Empresas (Organization)' }}
    />
    <Resource
      name="funcionarios"
      list={FuncionarioList}
      show={FuncionarioShow}
      options={{ label: 'Funcionarios (Organization)' }}
    />
  </Admin>
);

export default App;
