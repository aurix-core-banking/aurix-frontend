# Guia de Instalacao - Aurix Admin

## Pre-requisitos

- Node.js 16.x ou superior, npm 8.x ou superior, Git

## Instalacao

1. Clone o repositorio e acesse `apps/frontend/aurix-admin`
2. `npm install`
3. Copie `config.example.js` para `config.js` e ajuste a URL da API
4. `npm start` (ou `start-dev.bat` / `./start-dev.sh`)
5. Acesse `http://localhost:3000`

## Variaveis de ambiente

`.env`: `REACT_APP_API_URL=http://localhost:8080`, `REACT_APP_DEBUG`, `REACT_APP_DEFAULT_THEME`, etc.

## Build para producao

`npm run build`. Arquivos em `build/`.
