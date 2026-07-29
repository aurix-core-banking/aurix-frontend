# Guia de Desenvolvimento - Aurix Admin

## Estrutura do Projeto

- `src/components/` - Componentes reutilizaveis (Layout, Loading, Error)
- `src/pages/` - Dashboard, Clientes, Contas, Transacoes, Investimentos, PIX, Compliance, Auditoria, Analytics
- `src/providers/` - authProvider, dataProvider, i18nProvider
- `src/config/`, `src/constants/`, `src/hooks/`, `src/utils/`
- `theme.js`, `App.js`, `index.js`

## Padroes

Seguir convencoes do React Admin e Material-UI. Novos modulos: criar pasta em `src/pages/`, implementar List/Create/Edit/Show, registrar em `App.js` e na API.
