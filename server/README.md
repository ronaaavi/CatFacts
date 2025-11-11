# Backend (server/) — quick setup & commands

This project includes a small Express + MySQL backend in the `server/` folder. The backend provides simple CRUD routes for cats, breeds, developers and cat facts plus a small proxy for external cat images/facts.

Important: keep secrets out of source control. Edit `server/.env` with your local MySQL credentials before running the server.

Typical workflow (PowerShell)

1. Install dependencies (project root):

```powershell
npm install
```

2. Configure database credentials (edit `server/.env`):

- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

3. Create DB + tables and seed sample data:

```powershell
node server/scripts/migrate_and_seed.js
```

4. (optional) Seed extra facts from external API:

```powershell
node server/scripts/seedFacts.js
```

5. Start the backend:

```powershell
npm start
```

Expected output:

```
Server running on http://127.0.0.1:5050
```

Smoke-test the API (PowerShell)

```powershell
# list cats
Invoke-RestMethod 'http://127.0.0.1:5050/api/cats' | ConvertTo-Json -Depth 5

# random fact (proxied)
Invoke-RestMethod 'http://127.0.0.1:5050/api/facts/random' | ConvertTo-Json -Depth 5
```

Notes & troubleshooting

- If you get `ECONNREFUSED` when starting or calling endpoints, ensure MySQL is running and the credentials in `server/.env` are correct.
- On Windows, `localhost` can be intercepted by system HTTP listeners; the server binds to `127.0.0.1` by default to avoid this. Use `http://127.0.0.1:5050` when testing if `http://localhost:5050` returns 403.
- CORS: `server/.env` sets `CORS_ORIGIN` to `http://localhost:5173` (Vite dev). If you serve the frontend from a different origin, update that value.
- External APIs (TheCatAPI, MeowFacts) may require API keys or be intermittent; the controllers include basic fallbacks.

Wiring the frontend to the backend

- Frontend reads API base from `import.meta.env.VITE_API_URL` — check `.env` in project root and restart Vite after any changes.

If you want me to run the migration and start the server for you, tell me and I will run the scripts and report the output.
