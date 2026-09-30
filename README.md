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
- **Convex** — backs the contact form (`consultations` table + `/notify-consultation` HTTP action)
- **TanStack Query** for data fetching

Path alias: `@/` → `./src`.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Convex values
npm run dev            # dev server, pointing at the production backend via .env.local
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
| `VITE_CONVEX_URL` | Convex deployment URL (`*.convex.cloud`) |
| `VITE_CONVEX_SITE_URL` | Convex HTTP actions URL (`*.convex.site`) |
| `VITE_APP_URL` | Product app URL for the "Log in" link (default `https://hr.donjoafrica.com`) |

## Deployment (Cloudflare Pages)

- **Build command:** `npm run build` (runs `vite build` then `scripts/prerender.mjs`, which prerenders every
  public route to static HTML, generates `sitemap.xml`, `robots.txt`, `404.html`, `og-image.png` and
  `_redirects`). Prerender needs Chrome: set `CHROME_PATH` if it is not in a standard location (it skips
  gracefully and ships the SPA-only build if Chrome is missing).
- **Output directory:** `dist`
- `/admin` is client-only (`spa.html`, noindex, `Disallow: /admin`, `X-Robots-Tag` in `public/_headers`) and
  is never prerendered or listed in the sitemap. Unknown URLs get the noindex `404.html` with a real 404.
- Set the `VITE_*` environment variables in the Cloudflare Pages project (Production **and**
  Preview). Because Vite inlines them at build time, changing a value requires a redeploy.
  Never build production with a local `.env.local` present (it points at the local dev backend).

## Backend (Convex)

Tables (`convex/schema.ts`): `consultations` (leads), `partnerRequests`, `partners`, `pricingPlans`,
`analyticsEvents`, `admins`, `adminAuditLog`, `passkeys`, `webauthnChallenges`, `rateLimits`, `appSettings`
plus the Convex Auth tables. Public functions: `partners:submitRequest`, `partners:listPublished`,
`pricing:listPublished`, `analytics:track`, and the `POST /notify-consultation` HTTP action. Everything
under the admin console is gated server-side by `requireAdmin` (allow-list in the `admins` table).

### Auth environment variables (Convex dashboard, per deployment)

| Variable | Value |
|---|---|
| `JWT_PRIVATE_KEY` | RSA private key, PKCS8 PEM (2048-bit) |
| `JWKS` | JSON `{"keys":[{"use":"sig","alg":"RS256", ...public JWK}]}` for the same key |
| `SITE_URL` | Public site origin, e.g. `https://donjoafrica.com` |
| `WEBAUTHN_RP_ID` | Registrable domain for passkeys, e.g. `donjoafrica.com` |
| `WEBAUTHN_ORIGINS` | Comma list of allowed origins, e.g. `https://donjoafrica.com` |
| `WEBAUTHN_RP_NAME` | Optional display name, e.g. `Donjo Admin` |

Generate the key pair once:

```bash
node -e "const {generateKeyPairSync}=require('crypto');const fs=require('fs');const k=generateKeyPairSync('rsa',{modulusLength:2048});fs.writeFileSync('jwt.pem',k.privateKey.export({type:'pkcs8',format:'pem'}));fs.writeFileSync('jwks.json',JSON.stringify({keys:[{use:'sig',alg:'RS256',...k.publicKey.export({format:'jwk'})}]}))"
```

### Creating the first admin

There is no public sign-up. Create the first admin from a terminal with access to the deployment:

```bash
npx convex run admin:createAdmin '{"email":"you@example.com","name":"Your Name"}'
```

Then open `/admin/login`, choose **Activate your invited account**, and set a password (12+ characters).
After signing in, add a passkey under **Admin users**. Later admins can be invited from that page. Sign-ins,
idle sign-outs (after 30 minutes without activity) and every change are recorded in the audit log.
