import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ConvexReactClient, useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { ConvexAuthProvider, useAuthActions } from "@convex-dev/auth/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { BarChart3, ClipboardList, Fingerprint, Handshake, LayoutDashboard, Loader2, LogOut, Menu, Settings, ShieldCheck, Tag, Users, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { NotifyProvider } from "./ui";
import { Field, Input, PasswordInput } from "@/components/ui/field";
import Overview from "./pages/Overview";
import AnalyticsPage from "./pages/AnalyticsPage";
import Leads from "./pages/Leads";
import PartnersPage from "./pages/PartnersPage";
import PricingAdmin from "./pages/PricingAdmin";
import AdminsPage from "./pages/AdminsPage";
import AuditPage from "./pages/AuditPage";
import SettingsPage from "./pages/SettingsPage";

const client = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

/** Noindex + a unique, descriptive title for every admin screen. */
function useAdminMeta(title: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, name: string, content: string) => {
      let m = document.head.querySelector<HTMLMetaElement>(sel);
      if (!m) { m = document.createElement("meta"); m.name = name; document.head.appendChild(m); }
      m.content = content;
    };
    set('meta[name="robots"]', "robots", "noindex, nofollow, noarchive");
    set('meta[name="description"]', "description", "Donjo Admin. Restricted area.");
    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelectorAll('script[data-seo="page"]').forEach((n) => n.remove());
  }, [title]);
}

const Splash = () => (
  <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]" role="status" aria-label="Loading">
    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" aria-hidden="true" />
  </div>
);

/** Never renders admin UI unless the server confirms an active, allow-listed admin. */
function RequireAdmin() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const me = useQuery(api.admin.me);
  const { signOut } = useAuthActions();
  const location = useLocation();
  const stranger = isAuthenticated && me === null;
  useEffect(() => { if (stranger) void signOut(); }, [stranger, signOut]);
  if (isLoading || (isAuthenticated && me === undefined)) return <Splash />;
  if (!isAuthenticated || me === null) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Console email={me.email} name={me.name} />;
}

/* ------------------------------------------------------------------------ login */

const GENERIC = "Sign-in failed. Check your details, or contact an administrator.";

function Login() {
  useAdminMeta("Sign in · Donjo Admin");
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const me = useQuery(api.admin.me);
  const record = useMutation(api.admin.recordSignIn);
  const authOptions = useAction(api.passkeysNode.authenticationOptions);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signIn" | "activate">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const method = useRef<"password" | "passkey">("password");

  useEffect(() => {
    if (isAuthenticated && me) {
      void record({ method: method.current, userAgent: navigator.userAgent }).catch(() => undefined);
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, me, navigate, record]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "activate" && (password.length < 12 || password !== confirm)) {
      setError("Use at least 12 characters, and make sure both passwords match.");
      return;
    }
    setBusy(true);
    method.current = "password";
    try {
      await signIn("password", { email: email.trim().toLowerCase(), password, flow: mode === "activate" ? "signUp" : "signIn" });
    } catch {
      setError(GENERIC);
      setBusy(false);
    }
  };

  const passkey = async () => {
    setError("");
    setBusy(true);
    method.current = "passkey";
    try {
      const options = await authOptions({ email: email.trim() || undefined });
      const assertion = await startAuthentication({ optionsJSON: options });
      await signIn("passkey", { response: JSON.stringify(assertion) });
    } catch {
      setError(GENERIC);
      setBusy(false);
    }
  };

  if (isLoading) return <Splash />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[hsl(var(--background))] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950"><ShieldCheck className="h-6 w-6 text-amber-500" aria-hidden="true" /></span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Secure console</p>
            <h1 className="text-xl font-semibold text-foreground">Donjo Admin</h1>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Email" required>
            {(p) => <Input {...p} type="email" inputMode="email" autoComplete="username webauthn" enterKeyHint="next" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} />}
          </Field>
          <Field label={mode === "activate" ? "Choose a password" : "Password"} required helper={mode === "activate" ? "At least 12 characters." : undefined}>
            {(p) => <PasswordInput {...p} autoComplete={mode === "activate" ? "new-password" : "current-password"} enterKeyHint={mode === "activate" ? "next" : "go"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />}
          </Field>
          {mode === "activate" && (
            <Field label="Confirm password" required>
              {(p) => <PasswordInput {...p} autoComplete="new-password" enterKeyHint="go" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={busy} />}
            </Field>
          )}
          <div aria-live="polite">{error && <p role="alert" className="text-sm font-medium text-[hsl(var(--destructive-ink))]">{error}</p>}</div>
          <button type="submit" disabled={busy} className="neo-pill flex w-full items-center justify-center gap-2 disabled:opacity-70">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}{mode === "activate" ? "Activate account" : "Sign in"}
          </button>
        </form>
        {mode === "signIn" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-foreground/15" />or<span className="h-px flex-1 bg-foreground/15" /></div>
            <button type="button" onClick={passkey} disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[hsl(var(--field-border))] bg-white/60 text-sm font-semibold text-foreground hover:bg-white disabled:opacity-60">
              <Fingerprint className="h-5 w-5" aria-hidden="true" /> Sign in with a passkey
            </button>
          </>
        )}
        <button type="button" onClick={() => { setMode(mode === "signIn" ? "activate" : "signIn"); setError(""); }} className="mt-6 block w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
          {mode === "signIn" ? "Activate your invited account" : "Back to sign in"}
        </button>
      </div>
    </main>
  );
}

/* ----------------------------------------------------------------------- console */

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/partners", label: "Partners", icon: Handshake },
  { to: "/admin/pricing", label: "Pricing", icon: Tag },
  { to: "/admin/admins", label: "Admin users", icon: UserCog },
  { to: "/admin/audit", label: "Audit log", icon: ClipboardList },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const IDLE_MS = 30 * 60 * 1000;

function Console({ email, name }: { email: string; name: string | null }) {
  const { signOut } = useAuthActions();
  const idleOut = useMutation(api.admin.recordIdleSignOut);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [idleWarn, setIdleWarn] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  // 30-minute idle timeout: sign out (and audit it) after no activity.
  useEffect(() => {
    let last = Date.now();
    const bump = () => { last = Date.now(); setIdleWarn(false); };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));
    const id = window.setInterval(async () => {
      const idle = Date.now() - last;
      if (idle > IDLE_MS) { window.clearInterval(id); try { await idleOut(); } catch { /* ignore */ } void signOut(); }
      else if (idle > IDLE_MS - 2 * 60 * 1000) setIdleWarn(true);
    }, 15000);
    return () => { events.forEach((ev) => window.removeEventListener(ev, bump)); window.clearInterval(id); };
  }, [idleOut, signOut]);

  const links = useMemo(() => NAV.map((n) => (
    <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-orange-500/15 text-orange-300" : "text-slate-300 hover:bg-slate-800 hover:text-white")}>
      <n.icon className="h-5 w-5 shrink-0" aria-hidden="true" />{n.label}
    </NavLink>
  )), []);

  const rail = (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900"><ShieldCheck className="h-5 w-5 text-amber-500" aria-hidden="true" /></span>
        <span className="leading-tight"><span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">Secure console</span><span className="block text-base font-semibold text-white">Donjo Admin</span></span>
      </div>
      <nav aria-label="Admin sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">{links}</nav>
      <div className="border-t border-slate-800 p-4">
        <p className="truncate text-sm font-medium text-white">{name || email}</p>
        <p className="truncate text-xs text-slate-400">{email}</p>
        <button type="button" onClick={() => void signOut()} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-800"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
      </div>
    </>
  );

  return (
    <NotifyProvider>
      <div className="min-h-screen bg-[hsl(var(--background))] lg:pl-64">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 lg:flex">{rail}</aside>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-foreground/10 bg-[hsl(var(--background))]/90 px-4 backdrop-blur lg:hidden">
          <span className="flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="h-5 w-5 text-[hsl(var(--brand-strong))]" aria-hidden="true" />Donjo Admin</span>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-foreground/10"><Menu className="h-5 w-5" /></button>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-slate-950">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800"><X className="h-5 w-5" /></button>
              {rail}
            </div>
          </div>
        )}
        <main id="admin-main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {idleWarn && <p role="alert" className="mb-4 rounded-xl bg-amber-500/20 px-4 py-3 text-sm font-medium text-foreground">You'll be signed out soon because of inactivity. Move the mouse or press a key to stay signed in.</p>}
          <Outlet />
        </main>
      </div>
    </NotifyProvider>
  );
}

function NotFoundAdmin() {
  useAdminMeta("Page not found · Donjo Admin");
  return <p className="py-20 text-center text-muted-foreground">That admin page doesn't exist.</p>;
}

/** The whole admin area. Lazy-loaded, with its own Convex + auth providers, outside the public layout. */
export default function AdminApp() {
  return (
    <ConvexAuthProvider client={client}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<Overview useMeta={useAdminMeta} />} />
          <Route path="analytics" element={<AnalyticsPage useMeta={useAdminMeta} />} />
          <Route path="leads" element={<Leads useMeta={useAdminMeta} />} />
          <Route path="partners" element={<PartnersPage useMeta={useAdminMeta} />} />
          <Route path="pricing" element={<PricingAdmin useMeta={useAdminMeta} />} />
          <Route path="admins" element={<AdminsPage useMeta={useAdminMeta} />} />
          <Route path="audit" element={<AuditPage useMeta={useAdminMeta} />} />
          <Route path="settings" element={<SettingsPage useMeta={useAdminMeta} />} />
          <Route path="*" element={<NotFoundAdmin />} />
        </Route>
      </Routes>
    </ConvexAuthProvider>
  );
}
