# Donjo — Two-Project Renovation Brief (for Claude Code)

**Author:** Senior engineering handoff
**Audience:** Claude Code, running locally in VS Code inside each repo
**Goal:** Renovate two related front-end projects to production quality — remove all Lovable traces, fix broken/hanging code, eliminate every 404 and runtime error, and apply one cohesive, professional design system — *without* breaking working functionality.

> **How to use this document.** Place this file at the root of **each** repo (or a parent folder that contains both). Read it fully before touching code. There is a ready-to-paste kickoff prompt for each repo at the very end (§12). Do **not** start editing until you have completed Phase 0 (Orientation).

---

## 1. The two projects at a glance

| | **Landing site** | **Main application** |
|---|---|---|
| Domain | `donjoafrica.com` | `hr.donjoafrica.com` |
| Source repo | `remix-of-ascend-brand-studio` | `video-proof-hire` |
| Target repo | `donjoafrica.com` | `hr.donjoafrica.com` |
| Role | Public marketing / brand site | The real product (SaaS) |
| Size | ~5,900 LOC, 12 pages | ~20,700 LOC, 29 pages |
| Stack | Vite + React + TS + Tailwind + shadcn/ui | Same + Supabase auth/data, TanStack Query, framer-motion, PWA, react-pdf |
| Backend | Supabase (1 table: `consultations`) | Supabase (20 tables, views, RPCs, 6 edge functions) |
| Current health | **BROKEN — does not run** (see §4) | Builds, but has Lovable traces + needs design + QA |
| Hosting | Cloudflare Pages | Cloudflare Pages |

**What Donjo is:** a video-first, proof-of-work hiring platform. Applicants submit short "proof" video clips instead of CVs; the product generates skill radars and applicant dossiers for HR teams, startups, hackathons, accelerators, and enterprise. Brand line: **"Proof Over Promises."** Kenya / East-Africa first.

---

## 2. Operating principles (read this like a senior dev would brief a teammate)

1. **Never build blind.** Before editing a file, read it and the things it imports. Before deleting code, confirm nothing references it (`grep` the symbol across `src/`).
2. **Do not break working features to make them pretty.** The main app's auth, role guards, Supabase queries, and edge functions are *functioning logic*. Design work must preserve behavior. If a redesign would change a data flow, stop and call it out.
3. **Work in branches.** Create `git checkout -b renovation` in each repo. Commit in small, labeled increments (one concern per commit). Never force-push.
4. **Verify continuously.** After each phase run, in order: `npm run lint` → `npx tsc --noEmit` (type check) → `npm run build` → `npm run dev` and click through. A phase is not "done" until these pass.
5. **Keep it professional and formal.** This is a B2B HR product. The aesthetic target is clean, confident, restrained — not flashy. Reuse the existing visual language (neomorphic surfaces, the orange brand accent) and *refine* it; don't replace it wholesale.
6. **Surface assumptions.** If something is ambiguous (a missing asset, an undefined route target, an unknown env value), leave a clearly marked `// TODO(renovation):` and report it in your summary rather than inventing behavior.
7. **Don't fabricate secrets.** Never hard-code API keys or invent Supabase URLs. Env values come later from Cloudflare (see §9–10).

---

## 3. Shared technical context

- **Build tool:** Vite 5. Dev server runs on port `8080` (landing) — keep ports stable.
- **Router:** `react-router-dom` v6 with **`BrowserRouter`** (HTML5 history, not hash). This has a hard requirement for hosting: the server must serve `index.html` for unknown paths, or deep links / refreshes 404. See §10 (Cloudflare).
- **Path alias:** `@/` → `./src` (configured in `vite.config.ts` + tsconfig).
- **UI kit:** shadcn/ui (Radix primitives) lives in `src/components/ui/`. Don't rip these out; restyle via tokens.
- **Env contract (both apps):** the Supabase client reads `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`. The main app also references `VITE_SUPABASE_PROJECT_ID`. These must exist at build time (Vite inlines `VITE_*`). They are **publishable/anon** keys (safe in the browser) — but `.env` must still be git-ignored.
- **Package managers:** both repos currently ship **two** lockfiles (`bun.lockb` *and* `package-lock.json`). Pick **one** (recommend npm for Cloudflare Pages simplicity), delete the other lockfile, and document the choice. Mixed lockfiles cause non-reproducible installs.

---

## 4. Project A — Landing site (`donjoafrica.com`)

### What it is
A marketing site: Home, About, Expertise, Founder, Solutions (+ detail), Portfolio, Pricing, Partners, Connect (contact). Neomorphic, monochrome, **DM Sans**. A `consultations` Supabase table backs the contact form; a `notify-consultation` edge function emails on submit.

### 🔴 CRITICAL — the site currently does not run
- `src/App.tsx` is a **broken placeholder**. It imports `'your-theme-provider'` (a package that does not exist) and `'./corporateStyles'` (a file that does not exist), and renders an empty `<div>` with a comment. `src/main.tsx` renders this `App`, so **none of the real pages are wired into a router.** The 12 page components in `src/pages/` are currently orphaned.
- **Fix:** rebuild `src/App.tsx` as the real application root: `QueryClientProvider` + the existing `ThemeContext` provider (`src/context/ThemeContext.tsx`) + shadcn `Toaster`/`Sonner` + `BrowserRouter` wrapping the `Layout` (`src/components/Layout.tsx`, which renders `Navbar` + page + `Footer`) with a `<Routes>` block for every page and a catch-all `*` → `NotFound`.
- `src/pages/Index.tsx` is a leftover Lovable "Welcome to Your Blank App" fallback. Either delete it (preferred — `Home` is the real index) or replace its content. Do not route to it.

### 🟠 Routing mismatches to reconcile (these cause 404s)
- `Navbar.tsx` links to **`/contact`**, and `Home.tsx`'s hero CTA links to **`/contact`**, but the page file is **`Connect.tsx`**. Decide one canonical route (recommend `/contact`) and make the nav, the CTA, and the `<Route>` all agree.
- `Navbar.tsx` "Solutions" dropdown uses hash links (`/solutions#hr-for-startups`, `#hackathons`, `#accelerators`, `#universities`, `#enterprise`). Confirm `Solutions.tsx` actually renders elements with those `id`s; if not, add them or fix the links. Smooth-scroll-to-hash is already enabled via `scroll-behavior: smooth`.
- Add a wildcard route so any unknown URL renders `NotFound`, never a blank screen.

### 🟠 Leftover template branding ("siohioma")
This repo was remixed from a generic "Ascend Brand Studio" template. Remove all of it:
- References to `siohioma` in `src/pages/SolutionPage.tsx` and `src/pages/Portfolio.tsx`.
- Assets `src/assets/siohioma-logo.png` and `src/assets/siohioma-logo-dark.png` — replace with a real Donjo wordmark/logo (or a clean text wordmark if no logo asset exists; leave a `TODO` for the final logo).
- Audit `src/assets/` generally: `profile-*.jpeg`, `hero-*`, `startups-garage.jpeg` may be template stock. Keep only what's used and on-brand.

### Content polish (copy bugs found)
- `Home.tsx` feature list has an unfinished title `"Video "` (trailing space, truncated) — should read e.g. **"Video Proof"**.
- `Home.tsx` CTA copy: `"Join Hrs across East Africa"` → `"Join HR teams across East Africa"`.
- `trustedBy` logos are real but few (`Hotel Karanja`, `CampusLuku`, `Kike Glam Loft`). Keep as-is unless the client provides more.

### Landing Supabase
- Single table `consultations` (`id`, `name`, `email`, `brief`, `created_at`). Edge function `supabase/functions/notify-consultation/`. One migration in `supabase/migrations/`. This is the contact-form backend — verify it per §9.

---

## 5. Project B — Main application (`hr.donjoafrica.com`)

### What it is
The actual product. A role-aware SaaS for proof-based hiring. **It is well-architected — treat it with respect.**

### Architecture (already in place — preserve it)
- `src/App.tsx` is solid: lazy-loaded route components (`React.lazy` + `Suspense`), an `ErrorBoundary`, an `OrganicBackground`, a `PWAUpdatePrompt`, `AuthProvider` (`src/context/AuthContext`), `TooltipProvider`, and **role-based route guards**: `AdminRoute`, `FounderRoute`, `EmployerRoute` (in `src/components/auth/`).
- **Theme is force-locked to light** (`next-themes` with `forcedTheme="light"`, `storageKey="donjo-theme"`). The dark-theme tokens exist in CSS but are not currently reachable. Decide deliberately whether to enable dark mode; if you leave it light-only, don't ship a dead theme toggle.
- Loading UX: `RocketLoader`, `glass-panel` styles.
- **PWA:** `vite-plugin-pwa` + `workbox-window`. A service worker is generated at build. Be careful — a stale SW can serve old assets after deploy; ensure `PWAUpdatePrompt` works and the SW updates correctly on Cloudflare.

### Roles & route map
Roles: **admin, founder, employer, applicant/user.** Notable routes (see `src/App.tsx` for the full list): public `/`, `/feed`, `/auth`, `/reset-password`, `/jobs`, `/challenges`, `/create`, `/notifications`, `/profile`; guarded `/ventures` + `/ventures/:id` (admin), `/apply` + `/founder` (founder), `/admin` (admin), plus employer dashboards/settings. There are redirect routes (`/founder/dashboard` → `/founder`, `/admin/dashboard` → `/admin`). **Audit every route for: a working component, a sensible guard, and a redirect target that exists.** Add/confirm the wildcard `*` → `NotFound`.

### Supabase schema (this is the source of truth for any rebuild — §9)
- **Project id:** `rnmzxibxieaitnpyvtdh` (in `supabase/config.toml`).
- **44 migrations** in `supabase/migrations/` — the complete, replayable schema history.
- **Tables (20):** `challenge_submissions`, `challenges`, `comments`, `conversations`, `hackathon_cohorts`, `intro_requests`, `investor_bookmarks`, `job_applications`, `job_postings`, `likes`, `messages`, `pitch_decks`, `profiles`, `shortlists`, `user_roles`, `venture_founders`, `venture_scores`, `venture_tech_blocks`, `ventures`, `videos`.
- **Public views:** `profiles_public`, `top_talent`, `videos_public` (these power unauthenticated browsing — keep RLS intact).
- **RPC functions:** `get_all_public_profiles`, `get_public_profile`, `get_public_videos`, `get_user_private_videos`, `get_user_public_videos`, `get_user_role`, `has_role`, `update_job_application_status`, `update_user_role`, `update_venture_review_status`.
- **Supabase client:** PKCE auth flow, `detectSessionInUrl: true`, `persistSession`, `localStorage`. **Do not change the auth flow** — `/reset-password` and OAuth depend on `detectSessionInUrl` + PKCE.

### Edge functions (6) — `supabase/functions/`
`job-posting-alert`, `notify-status-change`, `password-reset-email`, `send-notification`, `webauthn-verify`, `welcome-email`.
- They read these secrets via `Deno.env.get`: **`RESEND_API_KEY`** (transactional email via Resend), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. These are **Supabase function secrets**, set in the Supabase dashboard / CLI — *not* in the front-end `.env`. Inventory and document them; do not commit them.
- `webauthn-verify` implements **passkey / biometric login** — high-value, security-sensitive. Don't refactor its crypto; only touch it for the Lovable-URL cleanup below.

### 🟠 Lovable references inside transactional emails (user-visible!)
`supabase/functions/welcome-email/index.ts` contains live `https://donjo.lovable.app` links (a "Get Started" button → `donjo.lovable.app/feed`, and a footer showing `donjo.lovable.app`). **These send to real users.** Replace every `donjo.lovable.app` with `https://hr.donjoafrica.com` (and the marketing footer link with `https://donjoafrica.com` where appropriate). Grep all six functions for `lovable` and any hard-coded `*.lovable.app` host.

---

## 6. The unified Donjo design system (apply to BOTH)

The two sites must look like one brand. Define the tokens once, mirror them in each repo's `src/index.css` + `tailwind.config.ts`.

**Direction:** clean, formal, confident B2B. Neomorphic surfaces used *sparingly and precisely* (neomorphism reads as cheap when overused — favor crisp cards, generous spacing, and one strong accent over mushy shadows everywhere). Light theme is primary.

- **Brand accent:** the existing "Success Orange" `hsl(14 100% 60%)` from the main app. Bring a restrained version into the landing (currently pure monochrome) — use it for primary CTAs and focus states only, not large fills.
- **Neutrals:** keep the warm-gray neomorphic base. Ensure text contrast meets WCAG AA (the muted grays on gray can fail — verify `muted-foreground` on `background`).
- **Type:** pick a deliberate pairing and use it in both repos. The landing uses DM Sans; the app uses Inter + JetBrains Mono. Standardize: a distinctive display face for headings + a clean body face. Avoid leaving two unrelated type systems across the domains.
- **Radius / shadow / spacing:** unify the radius scale and the neo-shadow tokens so cards/pills/inputs feel identical across sites.
- **Components:** restyle shadcn primitives through CSS variables, not by forking each component.
- **Motion:** keep it subtle and professional — one well-staggered page-load reveal, gentle hover states. No bouncing/confetti.

Deliverable for this phase: a short `DESIGN_SYSTEM.md` in each repo documenting the final tokens, so future edits stay consistent.

---

## 7. Phased execution plan

Run phases **in order**. Do not start design (Phase 4) before the app builds and runs clean (Phases 1–3). After every phase: lint → typecheck → build → manual click-through, then commit.

### Phase 0 — Orientation (no edits)
- Read this brief, `package.json`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, the router, and `src/index.css` in the repo you're in.
- Produce a 1-screen summary of what you found and your planned change list. Confirm it matches this brief; flag any discrepancy.
- `git checkout -b renovation`.

### Phase 1 — De-Lovable & repo hygiene
**Both repos:**
- Delete `.lovable/` directory (main app has one).
- Remove `lovable-tagger` from `vite.config.ts` (drop the `componentTagger()` plugin line) and from `package.json` devDependencies; reinstall.
- Rewrite `README.md` as a real project readme (what it is, stack, setup, env vars, deploy). No Lovable text or URLs.
- Choose one package manager; delete the unused lockfile.
- Ensure `.env` is in `.gitignore`; **untrack** the committed `.env` (`git rm --cached .env`) and add a committed `.env.example` listing variable *names only* (no values).
- Grep the whole repo for `lovable` (case-insensitive) and resolve every hit.

**Landing only:** remove `siohioma` references + assets (§4). 
**Main app only:** replace `donjo.lovable.app` URLs in the edge functions with the real domains (§5).

### Phase 2 — Make it build, kill errors & 404s
**Landing (priority — it's broken):** rebuild `src/App.tsx` into a real router root (§4); delete/neutralize the blank `Index.tsx`; reconcile `/contact` vs `Connect`; add the `*` → `NotFound` route; verify the Solutions hash anchors exist.
**Both:** `npm install`; get `npm run dev` running; fix all TypeScript errors (`npx tsc --noEmit`); fix all ESLint errors; remove hanging/dead code and unused imports/exports/files; click every nav item and confirm no route 404s or blank screens; confirm `npm run build` succeeds.

### Phase 3 — Supabase connectivity check (diagnose, don't rebuild yet)
- With current/placeholder env, the apps will likely **"fail to fetch"** from Supabase. That's expected if env is missing or the project is paused.
- Determine *why*: (a) env vars absent → note that real values arrive from Cloudflare later (§10), don't invent them; (b) env present but project unreachable/paused → record the exact error.
- Do a lightweight reachability test against the configured Supabase URL (e.g. a public REST/health request) and report: reachable? auth responds? a public view (`videos_public`/`profiles_public`) returns data?
- **Make the UI degrade gracefully** when Supabase is unavailable: show a clean error/empty state, never an uncaught exception or infinite spinner. This satisfies "no errors" even before the backend is finalized.
- **Do NOT create a new Supabase project in this phase.** Recreating the backend is a *last* phase, only if the existing project is confirmed dead once real env is supplied (§9).

### Phase 4 — Design renovation
- Implement the unified design system (§6) — tokens first, then components.
- **Landing:** polish every page to ship quality; consistent spacing, real content, on-brand imagery, strong hero, clear CTAs.
- **Main app:** apply tokens globally, then refine the highest-traffic screens first — `Auth`, `Feed`, primary dashboards (`FounderDashboard`/`EmployerDashboard`/`AdminPanel`), `Jobs`, `Profile` — screen by screen, preserving all data logic. Keep it formal and clean.
- Write `DESIGN_SYSTEM.md`.

### Phase 5 — Deploy prep (Cloudflare Pages) — see §10
- Add SPA fallback so deep links don't 404.
- Confirm build command + output dir; document required env vars for the Cloudflare dashboard.
- Verify the PWA service worker updates cleanly on the main app.

### Phase 6 — Final QA (see §11) and hand back
- Run the full acceptance checklist; produce a short report of what changed, what's verified, and any remaining `TODO`s (e.g. final logo, real env, optional new Supabase project).

### (Conditional) Phase 7 — New Supabase project
Only if Phase 3 + real env prove the existing project is dead/unrecoverable. Then: create a new Supabase project, replay `supabase/migrations/` (44 for the app, 1 for the landing), redeploy the edge functions, set function secrets (`RESEND_API_KEY`, service role, etc.), regenerate the client `types.ts`, and update env. The migrations make this fully reproducible.

---

## 8. Lovable-removal checklist (exact targets)

**Landing (`donjoafrica.com`):**
- [ ] `README.md` — rewrite
- [ ] `vite.config.ts` — remove `lovable-tagger` import + `componentTagger()` plugin
- [ ] `package.json` + lockfile — remove `lovable-tagger`
- [ ] `src/pages/SolutionPage.tsx`, `src/pages/Portfolio.tsx` — remove `siohioma`
- [ ] `src/assets/siohioma-logo.png`, `siohioma-logo-dark.png` — remove/replace
- [ ] grep `lovable` → 0 hits

**Main app (`hr.donjoafrica.com`):**
- [ ] `.lovable/` directory — delete
- [ ] `README.md` — rewrite
- [ ] `vite.config.ts` — remove `lovable-tagger` / `componentTagger()`
- [ ] `package.json` + lockfile — remove `lovable-tagger`
- [ ] `supabase/functions/welcome-email/index.ts` — replace `donjo.lovable.app` (2 spots)
- [ ] grep all 6 edge functions + `src/` for `lovable.app` → replace with real domains
- [ ] grep `lovable` → 0 hits

---

## 9. Supabase verification protocol

1. **Read** `supabase/config.toml` (project id) and `src/integrations/supabase/client.ts` (how env is consumed).
2. **Check env presence.** If `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are missing or placeholders, the "fail to fetch" is just missing config — note it, the user supplies real values from Cloudflare later. Do not guess values.
3. **Reachability** (once any real URL is available): hit the Supabase REST root / a public view and report status. Confirm auth endpoint responds.
4. **Graceful failure** in the UI regardless of backend state (loading → error/empty, never a crash).
5. **Decision gate:** existing project healthy → keep it. Existing project confirmed dead with real env → escalate to Phase 7 (new project from migrations). The 44 migrations + edge functions + `types.ts` are everything needed to recreate it.

---

## 10. Cloudflare deployment notes (both sites are on Cloudflare Pages)

- **SPA history fallback is mandatory.** Both apps use `BrowserRouter`. Without a fallback, refreshing or deep-linking any non-root path (`/pricing`, `/jobs`, `/admin`, …) returns a 404 from Cloudflare. Add a `public/_redirects` file containing:
  ```
  /*    /index.html   200
  ```
  (Cloudflare Pages reads `_redirects`. Verify after deploy by hard-refreshing a deep link.)
- **Build settings:** build command `npm run build`; output directory `dist` (Vite default). Node version pinned (e.g. an `.nvmrc` / `NODE_VERSION` env) for reproducible builds.
- **Env vars:** set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (and `VITE_SUPABASE_PROJECT_ID` for the app) in the Cloudflare Pages project → Settings → Environment variables, for **both** Production and Preview. Because Vite inlines `VITE_*` at build time, a value change requires a **redeploy**. *The user will provide these from Cloudflare in a later phase.*
- **Supabase function secrets** (`RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.) live in Supabase, not Cloudflare.
- **PWA caution (main app):** the service worker can serve stale assets after a deploy. Confirm Workbox is configured to update and that `PWAUpdatePrompt` prompts users to refresh.
- **Custom domains / CORS:** ensure the Supabase project's allowed URLs include `https://donjoafrica.com` and `https://hr.donjoafrica.com` (Auth redirect URLs + CORS), or auth callbacks will fail in production.

---

## 11. Final acceptance criteria (definition of done)

- [ ] `grep -ri lovable` → **0** hits in each repo (code, config, docs, emails).
- [ ] No "siohioma"/template branding anywhere in the landing.
- [ ] `npm run lint` clean; `npx tsc --noEmit` clean; `npm run build` succeeds — both repos.
- [ ] `npm run dev` runs with **no console errors**; every nav link and route resolves; **no 404s** (including after a hard refresh on a deep link, post-deploy).
- [ ] No dead/orphaned files, no unused exports, no commented-out blocks left hanging.
- [ ] Landing actually renders (App.tsx fixed) and all 12 pages are reachable and on-brand.
- [ ] Main app: all roles' primary flows load; Supabase failures degrade gracefully.
- [ ] One cohesive design system applied to both; `DESIGN_SYSTEM.md` written in each.
- [ ] `.env` untracked + git-ignored; `.env.example` committed; no secrets in the repo.
- [ ] `_redirects` present; Cloudflare build settings + required env documented in each README.
- [ ] A short CHANGE REPORT summarizing edits, verifications, and open `TODO`s.

---

## 12. Kickoff prompts (paste as your first Claude Code message)

### For the landing repo (`donjoafrica.com`)
```
Read DONJO_RENOVATION_BRIEF.md fully before editing anything. You are renovating the Donjo landing site (donjoafrica.com). Start with Phase 0: read package.json, vite.config.ts, src/main.tsx, src/App.tsx, the router, src/index.css, and the pages in src/pages/, then give me a summary of the current state and your change plan — do not edit yet.

Critical context you must verify first: src/App.tsx is a broken placeholder importing a non-existent 'your-theme-provider' and './corporateStyles', so the site does not currently run — the real pages are orphaned. Phase 2 must rebuild App.tsx into a real BrowserRouter root wrapping the existing Layout, wire every page, reconcile the /contact vs Connect.tsx route mismatch, and add a wildcard NotFound route. Also remove all Lovable + 'siohioma' template traces (Phase 1).

Work in a 'renovation' branch, in the documented phase order, committing per phase, and run lint + tsc --noEmit + build + a manual click-through after each phase. Do not invent Supabase env values — I'll provide them from Cloudflare later. Ask me before doing anything destructive.
```

### For the main app repo (`hr.donjoafrica.com`)
```
Read DONJO_RENOVATION_BRIEF.md fully before editing anything. You are renovating the Donjo main app (hr.donjoafrica.com) — a real, well-architected Supabase SaaS with role-based guards, 20 tables, RPCs, and 6 edge functions. Preserve all working logic; this is a design + cleanup renovation, not a rewrite.

Start with Phase 0: read package.json, vite.config.ts, src/App.tsx, the route map, the Supabase client, src/index.css, and src/components/auth/, then summarize state + plan — do not edit yet.

Priorities: Phase 1 removes all Lovable traces including the live donjo.lovable.app URLs inside supabase/functions/welcome-email (these email real users) and the .lovable/ dir. Phase 3 diagnoses Supabase connectivity ("fail to fetch") and makes the UI degrade gracefully — but do NOT create a new Supabase project; that's a conditional last phase only if the existing one is confirmed dead once I supply real env from Cloudflare. Phase 4 applies the unified design system and refines the highest-traffic screens first, preserving data flows.

Work in a 'renovation' branch, phase order, commit per phase, run lint + tsc --noEmit + build + click-through each phase. Don't fabricate secrets. Ask before destructive changes.
```

---

*End of brief. Keep this file in the repo; update the acceptance checklist as you complete items.*
