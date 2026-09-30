import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Inbox, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared admin-console primitives (mirrors the app console: calm panels, dark rail, orange accents). */

export function Panel({ title, description, action, children, className }: { title?: ReactNode; description?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-foreground/10 bg-white/50 p-5 shadow-sm sm:p-6", className)}>
      {(title || action) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-foreground/10", className)} aria-hidden="true" />
);

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground"><Inbox className="h-6 w-6" aria-hidden="true" /></span>
      <p className="font-medium text-foreground">{title}</p>
      {children && <p className="mt-1 max-w-md text-sm text-muted-foreground">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const Stat = ({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: "attention" }) => (
  <div className={cn("rounded-2xl border p-5", tone === "attention" ? "border-[hsl(var(--brand-strong)/.5)] bg-[hsl(var(--brand)/.1)]" : "border-foreground/10 bg-white/50")}>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-2 font-mono text-3xl font-bold leading-none text-foreground">{value}</p>
    {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export const Badge = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "good" | "bad" }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tone === "brand" && "bg-[hsl(var(--brand)/.18)] text-[hsl(var(--brand-ink))]", tone === "good" && "bg-emerald-600/15 text-emerald-800", tone === "bad" && "bg-red-600/15 text-red-800", tone === "neutral" && "bg-foreground/10 text-foreground/80")}>{children}</span>
);

export const Btn = ({ variant = "secondary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) => (
  <button
    type="button"
    {...p}
    className={cn(
      "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      variant === "primary" && "bg-[hsl(var(--brand-strong))] text-white hover:opacity-90",
      variant === "secondary" && "border border-[hsl(var(--field-border))] bg-white/60 text-foreground hover:bg-white",
      variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
      variant === "ghost" && "text-foreground hover:bg-foreground/10",
      className
    )}
  />
);

/* ------------------------------------------------------------------ notifications */

type Note = { id: number; kind: "ok" | "error"; text: string };
const NoteCtx = createContext<(kind: Note["kind"], text: string) => void>(() => undefined);
export const useNotify = () => useContext(NoteCtx);

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const n = useRef(0);
  const push = useCallback((kind: Note["kind"], text: string) => {
    const id = ++n.current;
    setNotes((x) => [...x, { id, kind, text }]);
    window.setTimeout(() => setNotes((x) => x.filter((y) => y.id !== id)), 5000);
  }, []);
  return (
    <NoteCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {notes.map((x) => (
          <div key={x.id} role={x.kind === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl", x.kind === "error" ? "bg-red-800" : "bg-foreground")}>
            {x.kind === "error" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            <span className="flex-1">{x.text}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setNotes((y) => y.filter((z) => z.id !== x.id))}><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </NoteCtx.Provider>
  );
}

/** Run an async action and report success or a friendly error. */
export function useAction() {
  const notify = useNotify();
  return useCallback(async <T,>(fn: () => Promise<T>, success?: string): Promise<T | undefined> => {
    try {
      const r = await fn();
      if (success) notify("ok", success);
      return r;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      const m = msg.match(/Uncaught Error: ([^\n]+?)(?: at |\n|$)/)?.[1] ?? msg.match(/Error: ([^\n]+)/)?.[1];
      notify("error", m && m.length < 140 ? m : "That didn't work. Please try again.");
      return undefined;
    }
  }, [notify]);
}

/* ------------------------------------------------------------------ dialogs */

/** Native <dialog>: focus trap, Esc and backdrop come from the platform. */
export function Dialog({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
      className={cn("m-auto w-[min(96vw,var(--w))] max-h-[92dvh] overflow-y-auto rounded-2xl border-0 bg-[hsl(var(--background))] p-0 shadow-2xl backdrop:bg-black/50", wide ? "[--w:56rem]" : "[--w:30rem]")}
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-foreground/10"><X className="h-5 w-5" /></button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Confirm({ open, title, body, confirmLabel = "Confirm", danger, onConfirm, onClose }: { open: boolean; title: string; body: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Btn>
      </div>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ data helpers */

export const fmtDate = (ms: number) => new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

type CsvCell = string | number | boolean | null | undefined;
const esc = (c: CsvCell) => {
  const s = c == null ? "" : String(c);
  const safe = /^[=+\-@]/.test(s) && Number.isNaN(Number(s)) ? `'${s}` : s; // neutralise spreadsheet formulas
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};
export function downloadCsv(name: string, headers: string[], rows: CsvCell[][]) {
  const body = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  requestAnimationFrame(() => { a.remove(); URL.revokeObjectURL(url); });
}

/** Horizontal bar list. */
export function BarList({ rows, empty = "No data yet" }: { rows: { name: string; count: number }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (!rows.length) return <p className="py-4 text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.name} className="text-sm">
          <div className="mb-1 flex justify-between gap-3"><span className="truncate text-foreground">{r.name}</span><span className="font-mono text-muted-foreground">{r.count}</span></div>
          <div className="h-2 rounded-full bg-foreground/10"><div className="h-2 rounded-full bg-[hsl(var(--brand-strong))]" style={{ width: `${(r.count / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Two-series line/area chart in SVG. */
export function LineChart({ data }: { data: { day: string; pageviews: number; visitors: number }[] }) {
  const w = 720, h = 220, pad = 28;
  const max = Math.max(1, ...data.map((d) => d.pageviews));
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const path = (k: "pageviews" | "visitors") => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full" role="img" aria-label={`Daily pageviews and visitors over ${data.length} days`}>
        {[0, 0.5, 1].map((t) => <line key={t} x1={pad} x2={w - pad} y1={y(max * t)} y2={y(max * t)} stroke="hsl(220 10% 60% / .35)" />)}
        <text x={4} y={y(max) + 4} fontSize="11" fill="hsl(220 12% 38%)">{max}</text>
        <path d={`${path("pageviews")} L${x(data.length - 1)},${h - pad} L${x(0)},${h - pad} Z`} fill="hsl(14 88% 44% / .12)" />
        <path d={path("pageviews")} fill="none" stroke="hsl(14 88% 44%)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={path("visitors")} fill="none" stroke="hsl(220 15% 25%)" strokeWidth="2" strokeDasharray="5 4" />
        <text x={pad} y={h - 6} fontSize="11" fill="hsl(220 12% 38%)">{data[0]?.day.slice(5)}</text>
        <text x={w - pad} y={h - 6} fontSize="11" textAnchor="end" fill="hsl(220 12% 38%)">{data.at(-1)?.day.slice(5)}</text>
      </svg>
      <p className="mt-1 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-0.5 w-4 bg-[hsl(var(--brand-strong))]" />Pageviews</span><span className="flex items-center gap-1.5"><i className="h-0.5 w-4 border-t-2 border-dashed border-foreground/70" />Visitors</span></p>
    </div>
  );
}
