# LBTLMS Frontend

React + TypeScript + Vite frontend for the LBTLMS Spring Boot backend.

## Tech Stack

- React + TypeScript + Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui-style components
- React Hook Form + Zod
- TanStack Table
- Sonner toasts
- Vitest + React Testing Library
- ESLint + Prettier + Husky + lint-staged

## Setup

1. Install dependencies:
   npm install
2. Generate OpenAPI types (optional if backend is running):
   npm run generate:api
3. Start dev server:
   npm run dev

## Commands

- npm run dev
- npm run build
- npm run lint
- npm run test
- npm run format
- npm run generate:api

## Backend Defaults

- API base URL: http://localhost:8081
- OpenAPI docs: http://localhost:8081/api-docs
- Versioned routes: /api/v1/*
