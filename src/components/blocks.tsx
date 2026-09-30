import { useEffect, useRef, useState } from "react";
import { Check, Minus, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import { SectionHeader, StatusBadge } from "./PageBits";
import { SceneView } from "./trailer/Trailer";
import type { DetailContent } from "@/data/types";
import type { PageDesign } from "@/data/pageDesign";

/* Shared building blocks. Each page composes its own order from these (see data/pageDesign.ts). */

interface BlockProps { page: DetailContent; design: PageDesign }

/** "The CV way" vs "the proof way" split. */
export function BeforeAfter({ page }: BlockProps) {
  return (
    <section id="beforeAfter" className="scroll-mt-28 space-y-10" aria-labelledby="ba-title">
      <SectionHeader align="center" eyebrow="Before and after" title={page.problem.title} id="ba-title" />
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal className="neo-pressed space-y-5 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The CV way</p>
          <ul className="space-y-4">
            {page.problem.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground/80">
                <X className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />{p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="neo-extruded space-y-5 p-6 ring-2 ring-[hsl(var(--brand-strong)/.4)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--brand-ink))]">The proof way</p>
          <ul className="space-y-4">
            {page.help.pillars.map((p) => (
              <li key={p.title} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--brand-ink))]" strokeWidth={3} aria-hidden="true" />
                <span><strong className="text-foreground">{p.title}.</strong> <span className="text-muted-foreground">{p.body}</span></span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Compact horizontal timeline with a line that draws as it enters view. */
export function DayTimeline({ page }: BlockProps) {
  return (
    <section id="day" className="scroll-mt-28 space-y-10" aria-labelledby="day-title">
      <SectionHeader align="center" eyebrow="In practice" title={page.workflowTitle} id="day-title" />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-4">
        <span className="absolute left-5 top-2 bottom-2 w-px bg-foreground/15 md:hidden" aria-hidden="true" />
        <span className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-foreground/15 md:block" aria-hidden="true" />
        {page.workflow.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 md:block md:text-center">
            <Reveal delay={i * 0.08} className="flex gap-4 md:block">
              <span className="squircle-icon relative z-10 h-10 w-10 shrink-0 text-sm font-bold tabular-nums text-foreground md:mx-auto">{i + 1}</span>
              <div className="md:mt-4">
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

const micro = ["mv-pulse", "mv-float", "mv-spin", "mv-wiggle", "mv-pulse", "mv-float"];
/** Bento grid: first capability is featured; each icon has its own micro-animation. */
export function Bento({ page }: BlockProps) {
  return (
    <section id="bento" className="scroll-mt-28 space-y-10" aria-labelledby="bento-title">
      <SectionHeader eyebrow="Capabilities" title={page.capabilitiesTitle} id="bento-title" />
      <ul className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {page.capabilities.map((c, i) => {
          const Icon = c.icon;
          const big = i === 0;
          return (
            <li key={c.title} className={cn(big && "lg:col-span-2 lg:row-span-2")}>
              <Reveal delay={(i % 4) * 0.06} className={cn("neo-extruded-sm group flex h-full flex-col gap-4 p-6 transition-shadow hover:shadow-none", big && "sm:p-10")}>
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("squircle-icon shrink-0", big ? "h-16 w-16" : "h-12 w-12")}>
                    <Icon className={cn(micro[i % micro.length], big ? "h-7 w-7" : "h-5 w-5", "text-foreground")} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className={cn("font-bold text-foreground", big ? "text-2xl sm:text-3xl tracking-tight" : "text-lg")}>{c.title}</h3>
                <p className={cn("text-muted-foreground", big ? "text-base sm:text-lg max-w-md" : "text-sm")}>{c.body}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Steps on the left; the selected step re-plays its scene on the right. */
export function Stepper({ page, design }: BlockProps) {
  const [i, setI] = useState(0);
  return (
    <section id="stepper" className="scroll-mt-28 space-y-10" aria-labelledby="step-title">
      <SectionHeader eyebrow="How it works" title={page.workflowTitle} id="step-title" />
      <div className="grid items-start gap-8 lg:grid-cols-5">
        <div role="tablist" aria-label="Steps" className="space-y-3 lg:col-span-2">
          {page.workflow.map((s, k) => (
            <button
              key={s.title}
              role="tab"
              id={`step-tab-${k}`}
              aria-selected={i === k}
              aria-controls="step-panel"
              tabIndex={i === k ? 0 : -1}
              onClick={() => setI(k)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); setI((k + 1) % page.workflow.length); }
                if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); setI((k + page.workflow.length - 1) % page.workflow.length); }
              }}
              className={cn("flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-shadow", i === k ? "neo-extruded-sm" : "neo-pressed opacity-80 hover:opacity-100")}
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold", i === k ? "bg-[hsl(var(--brand-strong))] text-white" : "bg-foreground/10 text-foreground")}>{k + 1}</span>
              <span><span className="block font-bold text-foreground">{s.title}</span><span className="text-sm text-muted-foreground">{s.body}</span></span>
            </button>
          ))}
        </div>
        <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${i}`} className="lg:col-span-3">
          <SceneView id={design.trailer} index={design.stepScenes[i]} restartKey={i} />
        </div>
      </div>
    </section>
  );
}

/** Audience tabs, each with its own scene. */
export function Roles({ page, design }: BlockProps) {
  const [i, setI] = useState(0);
  const scenes = design.roleScenes ?? [1, 2, 3];
  return (
    <section id="roles" className="scroll-mt-28 space-y-10" aria-labelledby="roles-title">
      <SectionHeader align="center" eyebrow="Who it's for" title={page.audienceTitle} id="roles-title" />
      <div role="tablist" aria-label="Audience" className="mx-auto flex max-w-full gap-2 overflow-x-auto p-1">
        {page.audience.map((a, k) => (
          <button key={a.title} role="tab" id={`role-tab-${k}`} aria-selected={i === k} aria-controls="role-panel" onClick={() => setI(k)}
            className={cn("shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-shadow", i === k ? "bg-foreground text-background" : "neo-extruded-sm !rounded-full text-muted-foreground hover:text-foreground")}>
            {a.title}
          </button>
        ))}
      </div>
      <div id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${i}`} className="grid items-center gap-8 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{page.audience[i].title}</h3>
          <p className="text-lg text-muted-foreground">{page.audience[i].body}</p>
        </div>
        <div className="lg:col-span-3"><SceneView id={design.trailer} index={scenes[i]} restartKey={i} /></div>
      </div>
    </section>
  );
}

/** Scrollytelling: the scene stays pinned while chapters scroll past. */
export function Pinned({ page, design }: BlockProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section id="pinned" className="scroll-mt-28 space-y-10" aria-labelledby="pin-title">
      <SectionHeader eyebrow="The story" title={page.workflowTitle} id="pin-title" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="sticky top-24 z-10 self-start lg:top-28">
          <SceneView id={design.trailer} index={design.stepScenes[active]} restartKey={active} />
          <p className="mt-3 text-center text-xs text-muted-foreground" aria-hidden="true">Chapter {active + 1} of {page.workflow.length}</p>
        </div>
        <ol className="space-y-4">
          {page.workflow.map((s, k) => (
            <li key={s.title} data-i={k} ref={(el) => (refs.current[k] = el)} className="flex min-h-[38vh] items-center">
              <div className={cn("space-y-2 rounded-3xl p-6 transition-all duration-500 sm:p-8", active === k ? "neo-extruded" : "opacity-45")}>
                <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-ink))]">0{k + 1}</span>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Two-column comparison table. */
export function Compare({ design }: BlockProps) {
  const c = design.compare;
  if (!c) return null;
  return (
    <section id="compare" className="scroll-mt-28 space-y-10" aria-labelledby="cmp-title">
      <SectionHeader align="center" eyebrow="Compare" title={c.title} id="cmp-title" />
      <Reveal>
        <div className="relative overflow-x-auto neo-extruded p-2 sm:p-4">
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">{c.title}</caption>
            <thead><tr>
              <th scope="col" className="p-4" />
              <th scope="col" className="p-4 text-sm font-semibold text-muted-foreground">{c.left}</th>
              <th scope="col" className="p-4 text-sm font-semibold text-[hsl(var(--brand-ink))]">{c.right}</th>
            </tr></thead>
            <tbody>
              {c.rows.map(([k, a, b]) => (
                <tr key={k} className="border-t border-foreground/10">
                  <th scope="row" className="p-4 text-sm font-semibold text-foreground">{k}</th>
                  <td className="p-4 text-sm text-muted-foreground">{a}</td>
                  <td className="p-4 text-sm font-medium text-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

const statusOrder = { live: 0, building: 1, roadmap: 2 } as const;
const statusText = { live: "Live now", building: "In development", roadmap: "On the roadmap" } as const;
/** What is live, in development and planned, straight from the capability tags. */
export function StatusTable({ page }: BlockProps) {
  const rows = [...page.capabilities].sort((a, b) => statusOrder[a.status ?? "live"] - statusOrder[b.status ?? "live"]);
  return (
    <section id="status" className="scroll-mt-28 space-y-10" aria-labelledby="status-title">
      <SectionHeader eyebrow="Honest status" title="What's live and what's next" id="status-title" />
      <Reveal>
        <ul className="neo-extruded divide-y divide-foreground/10 overflow-hidden !rounded-3xl">
          {rows.map((c) => {
            const st = c.status ?? "live";
            const Icon = c.icon;
            return (
              <li key={c.title} className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-4 sm:px-7">
                <Icon className="h-5 w-5 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                <span className="min-w-[10rem] flex-1 font-semibold text-foreground">{c.title}</span>
                <span className="hidden flex-[2] text-sm text-muted-foreground sm:block">{c.body}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", st === "live" ? "bg-foreground text-background" : "neo-pressed !rounded-full text-[hsl(var(--brand-ink))]")}>{statusText[st]}</span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

const roleMatrix: [string, boolean[]][] = [
  ["Talent", [true, false, false, false]], ["Employer", [false, true, true, false]], ["Founder", [true, false, false, false]],
  ["Investor", [false, false, true, false]], ["Judge", [false, false, true, false]], ["Admin", [false, true, true, true]],
];
const roleCols = ["Record and apply", "Post jobs and challenges", "Review applicants", "Admin console"];
/** Enterprise: who can do what (role-based access). */
export function Permissions() {
  return (
    <section id="permissions" className="scroll-mt-28 space-y-10" aria-labelledby="perm-title">
      <SectionHeader eyebrow="Role-based access" title="Six roles. Each sees only what it needs." id="perm-title" />
      <Reveal>
        <div className="relative overflow-x-auto neo-extruded p-2 sm:p-4">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">What each account role can do</caption>
            <thead><tr>
              <th scope="col" className="p-4"><ShieldCheck className="h-5 w-5 text-[hsl(var(--brand-ink))]" aria-hidden="true" /><span className="sr-only">Role</span></th>
              {roleCols.map((c) => <th key={c} scope="col" className="p-4 text-center text-sm font-semibold text-muted-foreground">{c}</th>)}
            </tr></thead>
            <tbody>
              {roleMatrix.map(([r, v]) => (
                <tr key={r} className="border-t border-foreground/10 hover:bg-[hsl(var(--brand)/.06)]">
                  <th scope="row" className="p-4 text-sm font-semibold text-foreground">{r}</th>
                  {v.map((on, j) => (
                    <td key={j} className="p-4 text-center">
                      {on ? (<><Check className="mx-auto h-5 w-5 text-[hsl(var(--brand-ink))]" strokeWidth={3} aria-hidden="true" /><span className="sr-only">Yes</span></>) : (<><Minus className="mx-auto h-4 w-4 text-muted-foreground/60" aria-hidden="true" /><span className="sr-only">No</span></>)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
