# Donjo — Landing Site (`donjoafrica.com`)

The public marketing site for **Donjo**, a video-first, proof-of-work hiring platform.
Applicants submit short "proof" video clips instead of CVs; the product generates skill
radars and applicant dossiers for HR teams, startups, hackathons, accelerators, and
enterprise. Brand line: **"Proof Over Promises."** Kenya / East-Africa first.

This repository is the marketing/brand site. The product application lives separately at
`hr.donjoafrica.com`.

## Tech stack

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) — neomorphic design system
- **react-router-dom v6** (`BrowserRouter` / HTML5 history)
- **Supabase** — backs the contact form (`consultations` table + `notify-consultation` edge function)
- **TanStack Query** for data fetching

Path alias: `@/` → `./src`.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in real Supabase values
npm run dev            # http://localhost:8080
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on port 8080 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite (Vitest) |

## Environment variables

Set these in `.env` for local dev, and in the hosting provider's dashboard for deploys.
All are **publishable/anon** values (safe in the browser); `.env` itself must stay
git-ignored. See `.env.example`.

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref id |

## Deployment (Cloudflare Pages)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA fallback:** `public/_redirects` rewrites all paths to `index.html` (status 200) so
  deep links and refreshes don't 404 under `BrowserRouter`.
- Set the `VITE_*` environment variables in the Cloudflare Pages project (Production **and**
  Preview). Because Vite inlines them at build time, changing a value requires a redeploy.

## Backend (Supabase)

- Table: `consultations` (`id`, `name`, `email`, `brief`, `created_at`).
- Edge function: `notify-consultation` (emails on contact-form submission via Resend).
- Migrations live in `supabase/migrations/`.

Function secrets (e.g. `RESEND_API_KEY`) are set in the Supabase dashboard, **not** in the
front-end `.env`.
