# Aurix Frontend

Internet banking (React 18) + dashboard admin (React Admin) + mobile banking (React Native).

## Stack

- **React 18** + **TypeScript** (web)
- **React Admin v4** (admin dashboard)
- **React Native 0.73** (mobile)
- **MUI v5** + **react-router-dom v6** + **react-query v3**
- **axios** com interceptors (auth header + 401 redirect)
- **npm workspaces** + **Turborepo** (monorepo)

## Apps

| App | Descrição | Framework |
|---|---|---|
| `aurix-web` | Internet banking para clientes | React (CRA) |
| `aurix-admin` | Dashboard admin (back-office) | React Admin v4 |
| `aurix-mobile` | App mobile banking | React Native |

## Estrutura

```
src/
├── pages/          # Páginas (co-localizadas com .test.js)
├── components/     # Componentes reutilizáveis
├── services/       # API service (axios)
├── context/        # React context providers
└── utils/          # Helpers
```

## Development

```bash
npm install            # Instalar todas as dependências
npm run build          # Build todos os apps (turbo)
npm run dev            # Start todos os dev servers
npm run test           # Rodar todos os testes
npm run lint           # Lint todos os apps

# App específico
npm run build -w aurix-web
npm run dev -w aurix-admin
```

## Padrões

- **Auth**: Token JWT via `localStorage` (`aurix_token`)
- **API**: `apiService.js` com interceptors para auth header e redirect 401
- **Proxy**: Ambiente dev proxy para `http://localhost:8080`
- **Testes**: `@testing-library/react` + `@testing-library/jest-dom`

## Relacionados

- [aurix-backend](https://github.com/aurix-core-banking/aurix-backend)
- [aurix-mobile](https://github.com/aurix-core-banking/aurix-mobile)
