# MyTeacher CRM MVP

Single-file CRM frontend MVP for testing dashboard, kanban deals, customers, tasks, team roles, onboarding, and sale success popup.

## Run locally

For design-only preview, open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 5174
```

Then open:

```text
http://127.0.0.1:5174/index.html
```

## Run NestJS backend

The backend is now a feature-based NestJS app using clean architecture boundaries, TypeORM, PostgreSQL, and JWT access/refresh tokens. It serves the frontend and keeps the same `/api/*` routes used by the current HTML app.

Create PostgreSQL database first:

```sql
CREATE DATABASE myteacher_crm;
```

Configure environment:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` if your PostgreSQL username/password differs.

```bash
npm install
npm run build
npm start
```

Open:

```text
http://127.0.0.1:4000
```

Use this URL for the connected full-stack version. The frontend will call `/api/*` routes from the same server.

Demo accounts:

```text
Admin: admin@myteacher.uz / admin12345
Manager: diyora@myteacher.uz / manager12345
```

Main API routes:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/team`
- `GET /api/deals`
- `POST /api/deals`
- `GET /api/tasks`
- `GET /api/docs`
- `GET /api/dashboard/summary`

## GitHub Pages

1. Push this folder to GitHub.
2. In the repository settings, enable GitHub Pages.
3. Select the branch and root folder.
4. GitHub will serve `index.html`.

## Files

- `index.html` - main deploy file.
- `crm.html` - working copy / original name.
- `backend/` - NestJS API server with feature-based clean architecture.

## Notes

The frontend is wired to the backend API. If the backend is not running, it falls back to the in-browser demo data for preview only. Demo seed data is inserted automatically unless `SEED_DEMO=false`.
