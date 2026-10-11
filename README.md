# DronexMC Network — Official Website

A complete, production-ready website for the **DronexMC** Minecraft Network.
Dark gaming UI, neon blue/purple identity, fully responsive, with a full admin dashboard.

## Tech

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript (no frameworks)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Storage:** Vercel KV (Redis) in production — with an automatic JSON-file fallback for local development
- **Auth:** token-based admin login (default `admin` / `admin`), designed to be upgraded to a real auth system

## Project structure

```
dronexmc/
├── index.html            # Public website
├── css/style.css         # Public styles
├── js/main.js            # Public site logic
├── admin/
│   ├── index.html        # Admin dashboard
│   ├── admin.css
│   └── admin.js
├── api/
│   ├── public.js         # GET  /api/public  -> public config
│   ├── login.js          # POST /api/login   -> admin token
│   └── admin.js          # GET/PUT /api/admin (token required)
├── lib/
│   ├── defaults.js       # Default configuration (seed data)
│   ├── db.js             # Storage layer (Vercel KV / JSON file)
│   ├── auth.js           # Password check + signed tokens
│   └── handlers.js       # Shared request handlers
├── assets/favicon.svg
├── server.js             # Local dev server (node server.js)
├── vercel.json
└── package.json
```

## Run locally

```bash
npm install   # optional, only needed for @vercel/kv
npm run dev   # http://localhost:3000
```

Admin panel: click **DronexMC** in the footer → login `admin` / `admin` → `/admin`.

## Deploy to Vercel

1. Push this folder to a Git repository and import it in Vercel, **or** run `vercel` from the project folder.
2. For **persistent storage**, connect a Vercel KV store (Storage → Create Database → KV) and attach it to the project. The environment variables `KV_REST_API_URL` and `KV_REST_API_TOKEN` are picked up automatically.
3. Without KV, data persists to a JSON file — fine for `vercel dev` / local runs.

### Environment variables (optional)

| Variable         | Default             | Purpose                        |
|------------------|---------------------|--------------------------------|
| `ADMIN_PASSWORD` | `admin`             | Admin login password           |
| `ADMIN_USERNAME` | `admin`             | Admin login username           |
| `JWT_SECRET`     | `dronex-dev-secret` | Token signing secret — set a strong value in production |

## Data model (all editable from the dashboard)

- **Site:** name, hero title/description, about title/description, footer text
- **Server:** status (ONLINE/OFFLINE), Java IP, Bedrock IP, Bedrock port
- **Links:** Discord URL, Store URL, Apply URL, Server join URL
- **Owners:** name, image, description, rank (Founder) — seeded with `Anas`
- **Staff:** name, image, description, rank — auto-sorted by rank priority (Manager → Helper)
- **Games:** name, description, image, status (Available / Coming Soon / Offline)

All data is served from `/api/public` — nothing content-related is hard-coded in the HTML.
