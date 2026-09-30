import type { CSSProperties, ReactNode } from "react";
import { Bell, Briefcase, LayoutGrid, MessageSquare, Play, Rocket, Search, Settings, Trophy, Bookmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Building blocks that re-create the real Donjo app UI (warm-grey neomorphic, orange accent) inside the 1280x720 trailer stage. */

const navItems = [
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: Briefcase, label: "Post a Job" },
  { icon: Trophy, label: "Challenges" },
  { icon: Bookmark, label: "Shortlist" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

export function Shell({
  active = 0, crumb, admin, children,
}: { active?: number; crumb: string; admin?: boolean; children: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-[hsl(var(--background))]">
      <aside className="neo-extruded absolute left-5 top-5 bottom-5 w-[236px] !rounded-[28px] p-5">
        <div className="mb-6 flex items-center gap-3">
          <span className="squircle-icon h-11 w-11"><Rocket className="h-5 w-5 text-[hsl(var(--brand-strong))]" /></span>
          <div>
            <p className="text-[17px] font-bold leading-tight text-foreground">Donjo</p>
            <p className="text-[12px] text-muted-foreground">Venture Engine</p>
          </div>
        </div>
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Main menu</p>
        <ul className="space-y-1">
          {navItems.map((n, i) => (
            <li key={n.label} className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px]", i === active ? "neo-extruded-sm !rounded-2xl font-semibold text-foreground" : "text-muted-foreground")}>
              <n.icon className={cn("h-4 w-4", i === active && "text-[hsl(var(--brand-strong))]")} />
              {n.label}
            </li>
          ))}
        </ul>
      </aside>
      <header className="absolute left-[280px] right-8 top-6 flex h-11 items-center justify-between">
        <div className="flex items-center gap-3 text-[14px] text-muted-foreground">
          {admin && (
            <span className="flex items-center gap-1.5 rounded-full bg-[hsl(var(--brand-strong))] px-3 py-1.5 text-[11px] font-bold uppercase text-white">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin mode
            </span>
          )}
          Dashboard <span>›</span> <span className="font-semibold text-foreground">{crumb}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="neo-inset flex h-10 w-[230px] items-center gap-2 !rounded-full px-4 text-[13px] text-muted-foreground"><Search className="h-4 w-4" />Search...</span>
          <span className="squircle-icon h-10 w-10"><Bell className="h-4 w-4 text-foreground" /></span>
        </div>
      </header>
      <main className="absolute bottom-6 left-[280px] right-8 top-[92px]">{children}</main>
    </div>
  );
}

export const Card = ({ className, style, children }: { className?: string; style?: CSSProperties; children?: ReactNode }) => (
  <div className={cn("neo-extruded absolute !rounded-[26px] p-6", className)} style={style}>{children}</div>
);

export const Pill = ({ children, tone = "muted", style }: { children: ReactNode; tone?: "muted" | "brand" | "dark" | "soft"; style?: CSSProperties }) => (
  <span
    style={style}
    className={cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-semibold",
      tone === "brand" && "bg-[hsl(var(--brand-strong))] text-white",
      tone === "dark" && "bg-foreground text-white",
      tone === "muted" && "neo-pressed !rounded-full text-muted-foreground",
      tone === "soft" && "bg-[hsl(var(--brand)/0.16)] text-[hsl(var(--brand-ink))]"
    )}
  >
    {children}
  </span>
);

export const Btn = ({ children, primary, className, style }: { children: ReactNode; primary?: boolean; className?: string; style?: CSSProperties }) => (
  <span
    style={style}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold",
      primary ? "bg-[hsl(var(--brand-strong))] text-white shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]" : "neo-extruded-sm !rounded-full text-foreground",
      className
    )}
  >
    {children}
  </span>
);

/** Video tile: dark frame with warm glow, optional play glyph and progress bar. */
export function Vid({ className, style, label, progress, play = true, hue = 0 }: { className?: string; style?: CSSProperties; label?: string; progress?: number; play?: boolean; hue?: number }) {
  return (
    <div className={cn("absolute overflow-hidden rounded-2xl bg-[#14171d]", className)} style={style}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at ${30 + hue * 12}% 20%, hsl(${14 + hue * 6} 70% 34% / .75), transparent 60%), linear-gradient(160deg, #1c2029, #0d0f13)` }} />
      {/* abstract presenter silhouette */}
      <div className="absolute left-1/2 top-[34%] h-[26%] w-[15%] -translate-x-1/2 rounded-full bg-white/10" style={{ aspectRatio: "1" }} />
      <div className="absolute left-1/2 top-[62%] h-[60%] w-[46%] -translate-x-1/2 rounded-t-[999px] bg-white/[.07]" />
      {play && (
        <span className="absolute left-1/2 top-1/2 flex h-[16%] min-h-9 aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90">
          <Play className="ml-0.5 h-[45%] w-[45%] text-foreground" fill="currentColor" />
        </span>
      )}
      {label && <span className="absolute bottom-2.5 left-3 text-[12px] font-medium text-white/85">{label}</span>}
      {progress !== undefined && (
        <span className="absolute inset-x-3 bottom-8 h-1 rounded-full bg-white/25">
          <span className="block h-full rounded-full bg-[hsl(var(--brand))]" style={{ width: `${progress * 100}%` }} />
        </span>
      )}
    </div>
  );
}

export const Kpi = ({ label, value, className, style }: { label: string; value: ReactNode; className?: string; style?: CSSProperties }) => (
  <Card className={cn("!p-5", className)} style={style}>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-2 font-mono text-[34px] font-bold leading-none text-foreground">{value}</p>
  </Card>
);

export const Field = ({ label, value, caret, className, style }: { label: string; value: string; caret?: boolean; className?: string; style?: CSSProperties }) => (
  <div className={cn("absolute", className)} style={style}>
    <p className="mb-1.5 text-[12px] font-semibold text-foreground">{label}</p>
    <div className="flex h-12 items-center rounded-xl border border-[hsl(var(--field-border))] bg-white/55 px-4 text-[15px] text-foreground">
      {value}
      {caret && <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-foreground" />}
    </div>
  </div>
);

