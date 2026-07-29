# AURIX Frontend (Monorepo)

Este diretório contém os portais e aplicações client-side da plataforma AURIX, organizados em um monorepo de alta performance.

## 🏗 Estrutura
Utilizamos **Turborepo** + **npm workspaces** para gestão das aplicações:
- **aurix-admin**: Painel administrativo (Back-office).
- **aurix-web**: Portal de Internet Banking para clientes.
- **aurix-mobile**: App móvel (React Native/Expo).

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Comandos do Monorepo
Na raiz da pasta `/apps/frontend`:
```bash
# Instalar dependências em todos os pacotes
npm install

# Iniciar todas as apps em modo desenvolvimento
npm run dev

# Buildar todas as apps para produção
npm run build
```

### Comandos via Makefile Raiz
```bash
# Na raiz do projeto
make build-frontend
```

## 🛠 Novas Funcionalidades
A estrutura de monorepo permite:
1. Cache inteligente de builds (via Turbo).
2. Compartilhamento de componentes e tipos (em breve).
3. Pipeline de CI unificado.

---
**Stack**: React | Turborepo | MUI | React Admin
