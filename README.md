# MyTeacher CRM MVP

Single-file CRM frontend MVP for testing dashboard, kanban deals, customers, tasks, team roles, onboarding, and sale success popup.

## Run locally

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 5174
```

Then open:

```text
http://127.0.0.1:5174/index.html
```

## GitHub Pages

1. Push this folder to GitHub.
2. In the repository settings, enable GitHub Pages.
3. Select the branch and root folder.
4. GitHub will serve `index.html`.

## Files

- `index.html` - main deploy file.
- `crm.html` - working copy / original name.

## Notes

This is currently a frontend MVP. Data is stored in browser memory only. For real production usage, connect it to a backend API and database.
