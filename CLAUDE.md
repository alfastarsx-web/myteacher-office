# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

MyTeacher CRM: a single-file HTML/JS frontend (`index.html`) backed by a NestJS API (`backend/`). The frontend can run standalone against in-browser demo data, or connect to the live backend for persistence (deals, tasks, team, docs, auth).

## Commands

Frontend (no build step — plain HTML/CSS/JS in one file):

```bash
python3 -m http.server 5174
# open http://127.0.0.1:5174/index.html
```

Backend (NestJS + TypeORM + PostgreSQL):

```bash
cd backend
cp .env.example .env   # edit DB_* and JWT_* values
npm install
npm run build           # nest build
npm start                # node dist/main.js
npm run start:dev       # nest start --watch
npm run check             # tsc --noEmit, no test suite is configured
```

Create the database first: `CREATE DATABASE mycrm;`. With `TYPEORM_SYNC=true` (env default), schema is auto-synced from entities — no migration step. Demo seed data is inserted automatically on boot unless `SEED_DEMO=false`.

The backend serves the frontend directly: `app.useStaticAssets` in [main.ts](backend/src/main.ts) points at the repo root, and the global `/api` prefix excludes the root `GET /` route. So running the backend on port 4000 and opening `http://127.0.0.1:4000` serves `index.html` with working `/api/*` calls — this is the normal way to run the connected full-stack app, not the static server above.

Demo accounts: `admin@myteacher.uz / admin12345` (admin), `diyora@myteacher.uz / manager12345` (manager).

## Backend architecture

Feature-based clean architecture under `backend/src/features/<feature>/`, each with up to three layers:

- `presentation/` — controllers, guards (e.g. `jwt-auth.guard.ts`, `admin.guard.ts`)
- `application/` — services containing business logic
- `infrastructure/` — TypeORM entities and persistence

Each feature has its own `<feature>.module.ts` wired into [app.module.ts](backend/src/app.module.ts). Features: `auth`, `users`, `stages`, `deals`, `integrations`, `tasks`, `docs`, `dashboard`, `notifications` (includes a WebSocket gateway), plus a top-level `seed/` module for demo data and a `root.controller.ts` serving the SPA shell.

Auth uses JWT access + refresh tokens (`auth/application/auth.service.ts`, refresh tokens persisted via `auth/infrastructure/refresh-token.entity.ts`). `JwtAuthGuard` and `AdminGuard` in `auth/presentation/` gate routes.

`HttpErrorFilter` ([http-error.filter.ts](backend/src/http-error.filter.ts)) is registered globally in `main.ts` for consistent API error responses.

## Frontend architecture

`index.html` is a ~5000-line single-file app (vanilla JS, no framework/bundler). Key points when editing it:

- All backend calls go through a shared `api(path, opts)` helper that hits `/api/*` routes (login, deals, tasks, team, docs, dashboard summary).
- If the backend is unreachable, API calls fall back to in-browser demo data (see the `console.warn('API fallback...')` / `dashboard summary fallback` paths) — this fallback exists for design-only preview, not as a general offline mode.
- Auth flow: login via `/api/auth/login`, silent refresh via `/api/auth/refresh`, logout via `/api/auth/logout`.
- Because everything lives in one file, search by feature keyword (e.g. `deals/bulk`, `dashboard/summary`) rather than expecting separate component files.

`crm.html` is the original/working-copy name for the same app; `index.html` is the deploy file actually served.

## Notes

- No automated test suite exists in either the frontend or backend (`npm run check` only does a TypeScript typecheck).
- GitHub Pages deployment serves `index.html` directly (static-only, demo-data mode, no backend).
