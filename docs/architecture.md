# Architecture

## Overview

The frontend is a single-page application (SPA) built with React and TypeScript. It communicates with backend services through REST APIs and WebSockets.

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (server state) + React Context (UI state)
- **Routing**: React Router v6
- **API Client**: Axios + generated TypeScript clients from OpenAPI specs

## Structure

```
apps/frontend/
├── src/
│   ├── api/          # API clients and hooks
│   ├── components/   # Shared UI components
│   ├── features/     # Feature modules
│   ├── layouts/      # Page layouts
│   ├── lib/          # Utilities
│   ├── routes/       # Route definitions
│   └── App.tsx       # Root component
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

## Key Design Decisions

- **React Query** for server state caching and automatic refetching
- **Code generation** from OpenAPI specs ensures type safety between frontend and backend
- **Feature-based folder structure** for scalability
