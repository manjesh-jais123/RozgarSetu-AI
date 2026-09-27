# AGENTS.md

## Project
React + TypeScript + Vite + Tailwind CSS v4 + Zustand + React Router + TanStack Query

## Commands
Run all commands from the `rozgarsetu-ai/` directory:

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check with `tsc -b` and build with `vite build`
- `npm run lint` — Run oxlint
- `npm run preview` — Preview production build locally

## Backend
- Backend code is in `../backend/` (Node.js + Express + TypeScript + MongoDB)
- Start backend dev server: `cd ../backend && npm run dev`
- Build backend: `cd ../backend && npm run build`
- Backend `USE_MOCK_API=true` toggle is controlled via `VITE_USE_MOCK_API` env var

## API Integration
- `VITE_USE_MOCK_API=true` in `.env` — Frontend uses mock services (no backend needed)
- `VITE_USE_MOCK_API=false` — Frontend calls backend REST APIs via `apiClient.ts`
- API base URL is `VITE_API_URL` (default: `http://localhost:3001/api`)

## Notes
- Lint has 1 known warning: `react(only-export-components)` for `useToast` in `src/components/ui/Toast.tsx` (architectural preference, not a code issue).
- AIChatBot includes voice recording support via Web Speech API and connects to backend LLM API.
- Build output goes to `dist/`.
