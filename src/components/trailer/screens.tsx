import type { ReactNode } from "react";
import { Check, Eye, Fingerprint, Heart, Lock, Mic, Send, Upload, X, Download, FileText, ShieldCheck } from "lucide-react";
import { Btn, Card, Field, Kpi, Pill, Shell, Vid } from "./ui";
import { Cursor, Toast, easeInOut, easeOut, lerp, pop, seg, typed, type CursorKey } from "./fx";

type S = { t: number };

/* ------------------------------------------------------------------ cards */

export function TitleCard({ t, kicker, title, sub }: S & { kicker: string; title: string; sub?: string }) {
  const words = title.split(" ");
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#12151b] text-center">
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 45%, hsl(14 80% 30% / .45), transparent 70%)", opacity: easeOut(seg(t, 0, 1.2)) }} />
      <p className="relative mb-6 text-[18px] font-semibold uppercase tracking-[0.32em] text-white/60" style={pop(t, 0.1, 0.5)}>{kicker}</p>
      <h2 className="relative max-w-[980px] text-[84px] font-bold leading-[1.02] tracking-tighter text-white">
        {words.map((w, i) => (
          <span key={i} className="inline-block" style={{ ...pop(t, 0.3 + i * 0.16, 0.5), marginRight: 18 }}>{w}</span>
        ))}
      </h2>
      {sub && <p className="relative mt-7 text-[24px] text-white/70" style={pop(t, 0.3 + words.length * 0.16 + 0.2, 0.5)}>{sub}</p>}
    </div>
  );
}

export function EndCard({ t, line, small }: S & { line: string; small?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#12151b] text-center">
      <div className="absolute inset-0" style={{ background: "radial-gradient(50% 50% at 50% 55%, hsl(14 80% 30% / .5), transparent 70%)" }} />
      <p className="relative text-[64px] font-bold tracking-tighter text-white" style={pop(t, 0.1, 0.6)}>Donjo</p>
      <p className="relative mt-4 text-[30px] font-semibold text-white" style={pop(t, 0.5, 0.6)}>
        {line.replace(/\.$/, "")}<span className="text-[hsl(var(--brand))]">.</span>
      </p>
      <p className="relative mt-8 text-[16px] uppercase tracking-[0.28em] text-white/50" style={pop(t, 1.0, 0.5)}>{small ?? "Illustrative preview"}</p>
    </div>
  );
}

/* --------------------------------------------------------------- recorder */

export function Recorder({ t }: S) {
  const rec = t > 1.0 && t < 4.6;
  const done = t >= 4.6;
  const secs = rec ? Math.floor((t - 1.0) * 9) : done ? 32 : 0;
  const mm = `0:${String(secs).padStart(2, "0")}`;
  return (
    <div className="absolute inset-0 bg-[#0b0b0c]">
      <Vid className="!rounded-none inset-0" play={false} hue={1} style={{ inset: 0, transform: `scale(${1 + seg(t, 0, 5) * 0.05})` }} />
      <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10"><X className="h-5 w-5 text-white" /></span>
      <span className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10"><Mic className="h-5 w-5 text-white" /></span>
      {rec && (
        <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-black/55 px-5 py-2 text-white">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" /> <span className="font-mono text-[18px]">{mm}</span>
        </div>
      )}
      {rec && (
        <div className="absolute bottom-[190px] left-1/2 flex h-12 -translate-x-1/2 items-end gap-1.5">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className="w-1.5 rounded-full bg-white/70" style={{ height: 8 + Math.abs(Math.sin(t * 6 + i * 0.7)) * 34 }} />
          ))}
        </div>
      )}
      <div className="absolute bottom-16 left-[210px] text-center text-white/80">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><Upload className="h-6 w-6" /></span>
        <p className="mt-2 text-[14px]">Upload</p>
      </div>
      <span className="absolute bottom-[70px] left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white/70">
        <span className="bg-[hsl(var(--brand-strong))] transition-none" style={{ width: rec ? 34 : 66, height: rec ? 34 : 66, borderRadius: rec ? 8 : 999, transform: `scale(${t > 0.9 && t < 1.1 ? 0.9 : 1})` }} />
      </span>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[15px] text-white/60">Record 60-120 seconds showcasing your skills</p>
      {done && (
        <Card className="!bg-[#f3f4f7] !w-[420px] left-1/2 top-1/2 !p-6" style={{ transform: `translate(-50%, -50%) scale(${0.92 + 0.08 * easeOut(seg(t, 4.6, 5.1))})`, opacity: easeOut(seg(t, 4.6, 5.0)) }}>
          <p className="text-[20px] font-bold text-foreground">Post your proof clip</p>
          <p className="mt-1 text-[14px] text-muted-foreground">Project walkthrough - {mm}</p>
          <div className="mt-5 flex gap-3"><Btn primary className="flex-1">Post</Btn><Btn className="flex-1">Retake</Btn></div>
        </Card>
      )}
      <Toast t={t} at={6.3}>Proof clip posted</Toast>
      <Cursor t={t} keys={[[0.1, 760, 520], [0.9, 640, 640, 1], [4.4, 640, 640, 1], [5.6, 560, 470], [6.2, 490, 470, 1]]} />
    </div>
  );
}

/* --------------------------------------------------------------- employer */

export function PostJob({ t }: S) {
  const skills = ["Prototyping", "User research", "Figma"];
  return (
    <Shell active={1} crumb="Post a Job">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Post a Job</h3>
      <Card className="left-0 top-[60px] h-[520px] w-[560px]">
        <Field label="Job title" value={typed("Product Designer", t, 0.4)} caret={t < 1.6} className="left-6 right-6 top-6" />
        <div className="absolute left-6 right-6 top-[110px]">
          <p className="mb-2 text-[12px] font-semibold text-foreground">Skills required</p>
          <div className="flex gap-2">{skills.map((s, i) => <Pill key={s} tone="soft" style={pop(t, 1.8 + i * 0.35)}>{s}</Pill>)}</div>
        </div>
        <Field label="Video prompt" value={typed("Walk us through a design you're proud of.", t, 3.0, 26)} caret={t > 3 && t < 5} className="left-6 right-6 top-[190px]" />
        <p className="absolute left-6 top-[280px] text-[13px] text-muted-foreground" style={pop(t, 4.6)}>Applicants answer with a short video.</p>
        <Btn primary className="absolute bottom-6 left-6 right-6 !py-4">Create Job Posting</Btn>
      </Card>
      <Card className="right-0 top-[60px] h-[300px] w-[330px]" style={pop(t, 2.2, 0.5)}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Preview</p>
        <p className="mt-3 text-[22px] font-bold text-foreground">{typed("Product Designer", t, 0.4) || "Job title"}</p>
        <div className="mt-3 flex flex-wrap gap-2">{skills.map((s, i) => t > 1.8 + i * 0.35 && <Pill key={s}>{s}</Pill>)}</div>
        <Vid className="left-6 right-6 bottom-6 h-[110px]" label="Video prompt" />
      </Card>
      <Toast t={t} at={6.4}>Job posted</Toast>
      <Cursor t={t} keys={[[0, 900, 300], [5.4, 300, 590], [6.2, 300, 590, 1]]} />
    </Shell>
  );
}

export function ApplyModal({ t }: S) {
  const sel = t > 1.2;
  return (
    <Shell active={1} crumb="Jobs">
      <div className="absolute inset-0 bg-foreground/25" />
      <Card className="left-1/2 top-1/2 h-[540px] w-[720px]" style={{ transform: "translate(-50%,-50%)" }}>
        <p className="text-[24px] font-bold text-foreground">Apply: Product Designer</p>
        <p className="mt-1 text-[14px] text-muted-foreground">Prompt: Walk us through a design you're proud of.</p>
        <div className="relative mt-5 h-[150px]">
          {[0, 1].map((i) => (
            <div key={i} className="absolute top-0" style={{ left: i * 300, width: 270, height: 150 }}>
              <Vid className="inset-0" style={{ inset: 0, outline: sel && i === 0 ? "3px solid hsl(var(--brand-strong))" : "none" }} label={i === 0 ? "Project walkthrough" : "Older clip"} hue={i} />
              {sel && i === 0 && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--brand-strong))]"><Check className="h-4 w-4 text-white" /></span>}
            </div>
          ))}
        </div>
        <Field label="Cover message" value={typed("Here's how I approached the brief.", t, 2.2, 22)} caret={t > 2.2 && t < 4} className="left-6 right-6 top-[270px]" />
        <Btn primary className="absolute bottom-6 right-6 !px-8">Submit application</Btn>
      </Card>
      <Toast t={t} at={5.4}>Application sent</Toast>
      <Cursor t={t} keys={[[0, 900, 500], [1.1, 250, 330, 1], [4.4, 950, 640], [5.2, 1010, 640, 1]]} />
    </Shell>
  );
}

export function EmployerDash({ t }: S) {
  const rows = ["Product Designer", "Frontend Engineer", "Community Lead"];
  const n = rows.filter((_, i) => t > 1.2 + i * 0.5).length;
  return (
    <Shell active={0} crumb="Employer Dashboard">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Welcome, Employer</h3>
      <p className="text-[15px] text-muted-foreground">Manage your hiring pipeline</p>
      <Kpi label="Active jobs" value={n} className="left-0 top-[86px] h-[110px] w-[290px]" style={pop(t, 0.3)} />
      <Kpi label="Applicants" value={Math.floor(seg(t, 2.5, 4.5) * 3)} className="left-[310px] top-[86px] h-[110px] w-[290px]" style={pop(t, 0.5)} />
      <Kpi label="Challenges" value={0} className="left-[620px] top-[86px] h-[110px] w-[290px]" style={pop(t, 0.7)} />
      <Card className="left-0 top-[220px] h-[300px] w-[910px]">
        <p className="text-[20px] font-bold text-foreground">My Jobs</p>
        {rows.map((r, i) => (
          <div key={r} className="absolute left-6 right-6 flex items-center justify-between rounded-2xl neo-pressed px-5 py-3.5" style={{ top: 64 + i * 66, ...pop(t, 1.2 + i * 0.5) }}>
            <span className="text-[16px] font-semibold text-foreground">{r}</span>
            <span className="flex gap-2"><Pill>Video prompt</Pill>{t > 2.5 + i * 0.6 && <Pill tone="soft">New applicants</Pill>}</span>
          </div>
        ))}
      </Card>
    </Shell>
  );
}

/* --------------------------------------------------------------- reviewer */

const queue = [
  { n: "Applicant 01", s: "Fintech" }, { n: "Applicant 02", s: "Education" },
  { n: "Applicant 03", s: "Health" }, { n: "Applicant 04", s: "Agritech" },
];

function reviewKeys(actions: [number, number, string][], rowY: (i: number) => number): CursorKey[] {
  const keys: CursorKey[] = [[0.3, 300, 200]];
  [...actions].sort((a, b) => a[0] - b[0]).forEach(([at, i, kind]) => {
    const x = kind === "rejected" ? 880 : 780;
    const y = rowY(i) + 68;
    keys.push([at - 0.8, x, y], [at, x, y, 1]);
  });
  return keys;
}

export function ReviewQueue({ t, actions = [[2.6, 1, "shortlisted"], [4.0, 2, "rejected"], [5.0, 0, "shortlisted"]] }: S & { actions?: [number, number, string][] }) {
  const status = (i: number) => actions.find((a) => a[1] === i && t > a[0] + 0.15)?.[2] ?? "submitted";
  const count = (s: string) => queue.filter((_, i) => status(i) === s).length;
  const rowY = (i: number) => 150 + i * 92;
  return (
    <Shell active={0} crumb="Review Queue" admin>
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Review Queue</h3>
      <Kpi label="Pending review" value={count("submitted")} className="left-0 top-[56px] h-[96px] w-[200px] !p-4" />
      <Kpi label="Shortlisted" value={count("shortlisted")} className="left-[216px] top-[56px] h-[96px] w-[200px] !p-4" />
      <Kpi label="Rejected" value={count("rejected")} className="left-[432px] top-[56px] h-[96px] w-[200px] !p-4" />
      {queue.map((q, i) => {
        const s = status(i);
        return (
          <div key={q.n} className="neo-extruded-sm absolute left-0 flex h-[76px] w-[900px] items-center !rounded-2xl px-5" style={{ top: rowY(i) + 30, ...pop(t, 0.3 + i * 0.25, 0.45), outline: s === "shortlisted" ? "2px solid hsl(var(--brand-strong) / .7)" : undefined }}>
            <Vid className="!relative !h-12 !w-[74px] shrink-0" play={false} hue={i} style={{ position: "relative", height: 48, width: 74 }} />
            <div className="ml-4 flex-1"><p className="text-[16px] font-semibold text-foreground">{q.n}</p><p className="text-[13px] text-muted-foreground">{q.s}</p></div>
            <Pill tone={s === "shortlisted" ? "brand" : "muted"}>{s}</Pill>
            <Btn primary className="ml-5 !px-5 !py-2 !text-[13px]">Shortlist</Btn>
            <Btn className="ml-2 !px-5 !py-2 !text-[13px]">Reject</Btn>
          </div>
        );
      })}
      <Cursor t={t} keys={reviewKeys(actions, rowY)} />
    </Shell>
  );
}

export function VideoReview({ t }: S) {
  const play = t > 0.8;
  const prog = play ? seg(t, 0.8, 5.2) * 0.6 : 0;
  return (
    <Shell active={0} crumb="Applicant" admin>
      <Vid className="left-0 top-0 h-[470px] w-[640px]" progress={prog} label="Project walkthrough" play={!play} />
      {play && <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[12px] text-white" style={pop(t, 1)}>Playing</span>}
      <Card className="right-0 top-0 h-[470px] w-[250px] !p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">{["Frontend", "Research", "Storytelling"].map((s, i) => <Pill key={s} tone="soft" style={pop(t, 1.6 + i * 0.3)}>{s}</Pill>)}</div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Industry</p>
        <div className="mt-2 flex flex-wrap gap-2"><Pill style={pop(t, 2.6)}>Fintech</Pill></div>
        <Btn primary className="mt-8 w-full">{t > 4.6 ? "Shortlisted" : "Shortlist"}</Btn>
        <Btn className="mt-3 w-full">Message</Btn>
      </Card>
      <Toast t={t} at={4.8}>Added to shortlist</Toast>
      <Cursor t={t} keys={[[0, 900, 620], [0.6, 320, 235], [0.8, 320, 235, 1], [4.0, 1050, 340], [4.6, 1050, 330, 1]]} />
    </Shell>
  );
}

/* ------------------------------------------------------------- skills / cohort */

export function SkillTagging({ t }: S) {
  const chips = ["Data analysis", "Storytelling", "Python"];
  return (
    <Shell active={6} crumb="Edit Profile">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Skills and industry</h3>
      <Card className="left-0 top-[64px] h-[470px] w-[600px]">
        <p className="text-[12px] font-semibold text-foreground">Skills</p>
        <div className="neo-inset mt-2 flex min-h-[56px] flex-wrap items-center gap-2 !rounded-xl p-3">
          {chips.map((c, i) => t > 1 + i * 1.1 && <Pill key={c} tone="soft" style={pop(t, 1 + i * 1.1)}>{c}</Pill>)}
          <span className="text-[14px] text-muted-foreground">{typed("Add a skill...", t, 0, 0)}</span>
        </div>
        <p className="mt-6 text-[12px] font-semibold text-foreground">Industry</p>
        <div className="mt-2 flex h-12 items-center justify-between rounded-xl border border-[hsl(var(--field-border))] bg-white/55 px-4 text-[15px]">
          <span>{t > 5.6 ? "Fintech" : "Choose one"}</span><span className="text-muted-foreground">v</span>
        </div>
        {t > 4.6 && t < 5.7 && (
          <div className="absolute left-6 right-6 top-[248px] rounded-xl border border-[hsl(var(--field-border))] bg-[#f3f4f7] p-1.5 shadow-xl" style={pop(t, 4.6, 0.25)}>
            {["Education", "Fintech", "Health", "Agritech"].map((o, i) => <div key={o} className={`rounded-lg px-3 py-2 text-[15px] ${o === "Fintech" && t > 5.2 ? "bg-[hsl(var(--brand)/.16)] font-semibold" : ""}`}>{o}</div>)}
          </div>
        )}
        <p className="mt-6 text-[12px] font-semibold text-foreground">Video category</p>
        <div className="mt-2 flex gap-2"><Pill style={pop(t, 6.2)}>Design</Pill><Pill style={pop(t, 6.4)}>Engineering</Pill></div>
      </Card>
      <Card className="right-0 top-[64px] h-[470px] w-[280px]" style={pop(t, 0.3)}>
        <Vid className="left-6 right-6 top-6 h-[150px]" label="Your proof clip" />
        <p className="absolute left-6 top-[200px] text-[15px] font-semibold text-foreground">Findable by skill</p>
        <p className="absolute left-6 right-6 top-[228px] text-[13px] text-muted-foreground">Tags help reviewers browse proof by what it shows.</p>
      </Card>
      <Cursor t={t} keys={[[0, 900, 600], [0.8, 400, 250], [4.4, 400, 335], [5.0, 400, 335, 1], [5.4, 330, 416, 1]]} />
    </Shell>
  );
}

const axes = ["Tech", "Product", "Growth", "Operations", "Leadership"];
const vals = [0.82, 0.6, 0.45, 0.55, 0.7];
export function radarPts(cx: number, cy: number, r: number, scale: number) {
  return axes.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + Math.cos(a) * r * vals[i] * scale, cy + Math.sin(a) * r * vals[i] * scale];
  });
}
export function CohortRadar({ t }: S) {
  const g = easeOut(seg(t, 0.6, 3.2));
  const cx = 250, cy = 230, r = 170;
  const poly = radarPts(cx, cy, r, g).map((p) => p.join(",")).join(" ");
  return (
    <Shell active={0} crumb="Analytics" admin>
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Analytics</h3>
      <Card className="left-0 top-[64px] h-[480px] w-[520px]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Skill radar - cohort</p>
        <svg viewBox="0 0 500 460" className="absolute left-0 top-6 h-[420px] w-full">
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <polygon key={k} points={radarPts(cx, cy, r / 0.82 * 0.82, 1).map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return `${cx + Math.cos(a) * r * k},${cy + Math.sin(a) * r * k}`; }).join(" ")} fill="none" stroke="hsl(220 10% 60% / .5)" />
          ))}
          {axes.map((a, i) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return <text key={a} x={cx + Math.cos(ang) * (r + 34)} y={cy + Math.sin(ang) * (r + 30) + 4} textAnchor="middle" fontSize="14" fontWeight="600" fill="hsl(220 15% 20%)">{a}</text>; })}
          <polygon points={poly} fill="hsl(14 88% 44% / .35)" stroke="hsl(14 88% 44%)" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </Card>
      <Card className="right-0 top-[64px] h-[220px] w-[360px]" style={pop(t, 1.2)}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Built from tags</p>
        <div className="mt-3 flex flex-wrap gap-2">{["Tech", "Product", "Growth", "Operations", "Leadership"].map((a) => <Pill key={a} tone="soft">{a}</Pill>)}</div>
        <p className="mt-4 text-[14px] text-muted-foreground">Applicant industries grouped into five domains.</p>
      </Card>
      <Card className="right-0 top-[300px] h-[244px] w-[360px]" style={pop(t, 3.6, 0.5)}>
        <div className="flex items-center justify-between"><p className="text-[16px] font-bold text-foreground">Per-applicant radar</p><Pill tone="soft">On the roadmap</Pill></div>
        <div className="mt-4 flex items-center gap-4 opacity-60">
          <svg width="110" height="110" viewBox="0 0 110 110"><polygon points={radarPts(55, 55, 42, 1).map((p) => p.join(",")).join(" ")} fill="none" stroke="hsl(220 10% 50%)" strokeDasharray="4 4" strokeWidth="2" /></svg>
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Not built yet.</p>
      </Card>
    </Shell>
  );
}

/* -------------------------------------------------------- overview + dossier */

export function AdminOverview({ t, cursor = true, exportAt = 3.6 }: S & { cursor?: boolean; exportAt?: number }) {
  const path = Array.from({ length: 30 }, (_, i) => [i * 21, 130 - (Math.sin(i * 0.5) * 30 + Math.sin(i * 0.19) * 24 + i * 1.3 + 40)]);
  const shown = Math.floor(seg(t, 0.5, 3) * 30);
  const d = path.slice(0, Math.max(shown, 2)).map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const arcs = [0.38, 0.27, 0.2, 0.15];
  let acc = 0;
  return (
    <Shell active={0} crumb="Venture Engine" admin>
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Venture Engine</h3>
      <p className="text-[14px] text-muted-foreground">Program management and application review</p>
      <Btn className="absolute right-0 top-0 !text-[13px]"><Download className="h-4 w-4" />Download Applicant Dossier</Btn>
      <div className="absolute left-0 top-[84px] flex gap-3">
        {["Overview", "Analytics", "Review Queue"].map((x, i) => <Pill key={x} tone={i === 0 ? "dark" : "muted"}>{x}</Pill>)}
      </div>
      {["Pending review", "Total applications", "Shortlisted", "Rejected"].map((k, i) => (
        <Kpi key={k} label={k} value={[2, 4, Math.floor(seg(t, 2, 3) * 1), 1][i]} className="top-[130px] h-[92px] w-[200px] !p-4" style={{ left: i * 216, ...pop(t, 0.2 + i * 0.12) }} />
      ))}
      <Card className="left-0 top-[240px] h-[290px] w-[640px]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Application velocity</p>
        <svg viewBox="0 0 620 140" className="absolute inset-x-6 bottom-6 h-[190px] w-[590px]"><path d={d} fill="none" stroke="hsl(14 88% 44%)" strokeWidth="3.5" strokeLinecap="round" /></svg>
      </Card>
      <Card className="left-[660px] top-[240px] h-[290px] w-[250px]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Cohort composition</p>
        <svg viewBox="0 0 120 120" className="mx-auto mt-4 h-[170px] w-[170px] -rotate-90">
          {arcs.map((a, i) => { const c = 2 * Math.PI * 42; const len = a * c * easeOut(seg(t, 0.8 + i * 0.3, 1.8 + i * 0.3)); const off = -acc * c; acc += a; return <circle key={i} cx="60" cy="60" r="42" fill="none" strokeWidth="16" stroke={["hsl(14 88% 44%)", "hsl(14 70% 62%)", "hsl(220 12% 38%)", "hsl(220 12% 68%)"][i]} strokeDasharray={`${len} ${c}`} strokeDashoffset={off} />; })}
        </svg>
      </Card>
      {cursor && <Cursor t={t} keys={[[0.5, 300, 300], [exportAt - 0.8, 1020, 34], [exportAt, 1020, 34, 1]]} />}
    </Shell>
  );
}

export function DossierExport({ t }: S) {
  const p = seg(t, 0.6, 2.2);
  const sheet = (k: number) => {
    const fly = easeOut(seg(t, 0.6 + k * 0.25, 1.6 + k * 0.25));
    const turn = k < 2 ? easeInOut(seg(t, 3.0 + k * 0.6, 3.7 + k * 0.6)) : 0;
    return (
      <div key={k} className="absolute left-1/2 top-1/2 h-[520px] w-[380px] origin-left rounded-md bg-white shadow-2xl" style={{ transform: `translate(${-190 + (1 - fly) * 300 + k * 6}px, ${-260 + (1 - fly) * -260 + k * 5}px) rotateY(${-turn * 160}deg)`, opacity: fly, zIndex: 10 - k, backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}>
        <div className="p-8">
          <p className="text-[22px] font-bold text-[#1c1f26]">Applicant Dossier</p>
          <p className="mt-1 text-[11px] text-slate-500">High-density applicant summary</p>
          <div className="mt-5 grid grid-cols-[1.1fr_1.2fr_1.5fr] bg-slate-200 px-3 py-2 text-[10px] font-bold text-slate-700"><span>Applicant Name</span><span>Job Role</span><span>Video Portfolio</span></div>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="grid grid-cols-[1.1fr_1.2fr_1.5fr] items-center border-b border-slate-200 px-3 py-3.5">
              <span className="h-2 w-[70%] rounded bg-slate-300" /><span className="h-2 w-[55%] rounded bg-slate-300" /><span className="h-2 w-[80%] rounded bg-emerald-600/70" style={{ opacity: seg(t, 1.6 + i * 0.12, 2) }} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="absolute inset-0">
      <div style={{ opacity: 1 - p * 0.65 }}><AdminOverview t={Math.min(t + 3.6, 6)} exportAt={0.1} cursor={false} /></div>
      <div className="absolute inset-0 bg-foreground/35" style={{ opacity: p }} />
      <div className="absolute inset-0" style={{ perspective: 1600 }}>{[2, 1, 0].map(sheet)}</div>
      <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-4" style={pop(t, 4.4)}>
        <span className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-foreground shadow-xl"><FileText className="h-5 w-5 text-[hsl(var(--brand-strong))]" />dossier.pdf</span>
        <span className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-[15px] font-semibold text-foreground shadow-xl"><FileText className="h-5 w-5" />CSV fallback</span>
      </div>
      <Toast t={t} at={4.6}>Dossier ready</Toast>
    </div>
  );
}

/* ----------------------------------------------------------------- pipeline */

export function Pipeline({ t }: S) {
  const cols = ["Pending", "Reviewed", "Shortlisted", "Rejected"];
  // [card, startCol, endCol, moveAt]
  const cards: [string, number, number, number][] = [
    ["Applicant 01", 0, 2, 2.4], ["Applicant 02", 0, 1, 1.4], ["Applicant 03", 0, 3, 3.6], ["Applicant 04", 0, 1, 4.4], ["Applicant 05", 0, 0, 0],
  ];
  const colOf = (c: (typeof cards)[number]) => (t > c[3] + 0.6 ? c[2] : c[1]);
  const slot: Record<number, number> = {};
  return (
    <Shell active={0} crumb="Pipeline" admin>
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Pipeline</h3>
      {cols.map((c, i) => (
        <div key={c} className="neo-pressed absolute top-[70px] h-[440px] w-[215px] !rounded-[24px] p-4" style={{ left: i * 232 }}>
          <div className="flex items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">{c}<Pill>{cards.filter((k) => colOf(k) === i).length}</Pill></div>
        </div>
      ))}
      {cards.map((c) => {
        const from = c[1], to = c[2];
        const move = easeInOut(seg(t, c[3], c[3] + 0.6));
        const col = colOf(c);
        slot[col] = (slot[col] ?? 0) + 1;
        const y = 130 + (slot[col] - 1) * 74;
        return (
          <div key={c[0]} className="neo-extruded-sm absolute flex h-[60px] w-[183px] items-center gap-2 !rounded-2xl px-3" style={{ left: lerp(from, to, move) * 232 + 16, top: y, ...pop(t, 0.2), zIndex: move > 0 && move < 1 ? 5 : 1, transform: `scale(${move > 0 && move < 1 ? 1.06 : 1})` }}>
            <Vid className="!relative !h-9 !w-12 shrink-0" play={false} style={{ position: "relative", height: 36, width: 48 }} />
            <span className="text-[13px] font-semibold text-foreground">{c[0]}</span>
          </div>
        );
      })}
    </Shell>
  );
}

/* ----------------------------------------------------------------- velocity */

const GRID: [number, number][] = [
  [1, 0], [4, 0], [7, 0], [0, 1], [3, 1], [4, 1], [6, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [6, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [8, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [8, 5], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [8, 6],
  [0, 7], [1, 7], [8, 7], [0, 8],
];
export function VelocityMap({ t }: S) {
  return (
    <Shell active={0} crumb="Analytics" admin>
      <div className="flex items-center gap-3"><h3 className="text-[34px] font-bold tracking-tight text-foreground">Applicants by county</h3><Pill tone="soft">In development</Pill></div>
      <Card className="left-0 top-[64px] h-[480px] w-[520px]">
        <div className="absolute left-8 top-8">
          {GRID.map(([c, r], i) => {
            const on = seg(t, 0.4 + ((i * 7) % 47) * 0.06, 0.9 + ((i * 7) % 47) * 0.06);
            const heat = ((i * 13) % 5) / 4;
            return <span key={i} className="absolute rounded-md" style={{ left: c * 50, top: r * 46, width: 44, height: 40, transform: `scale(${easeOut(seg(t, 0, 0.6 + i * 0.02))})`, background: on > 0.99 && heat > 0.2 ? `hsl(14 88% ${64 - heat * 26}%)` : "hsl(220 14% 78%)", transition: "background .3s" }} />;
          })}
        </div>
      </Card>
      <Card className="right-0 top-[64px] h-[230px] w-[380px]" style={pop(t, 1)}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Time to decision</p>
        <svg viewBox="0 0 200 110" className="mx-auto mt-2 h-[140px]">
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="hsl(220 14% 78%)" strokeWidth="16" strokeLinecap="round" />
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="hsl(14 88% 44%)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${251 * easeOut(seg(t, 1.6, 4)) * 0.6} 251`} />
        </svg>
        <p className="text-center text-[13px] text-muted-foreground">From real review timestamps</p>
      </Card>
      <Card className="right-0 top-[314px] h-[230px] w-[380px]" style={pop(t, 2.2)}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Applications per day</p>
        <svg viewBox="0 0 320 120" className="absolute inset-x-6 bottom-5 h-[130px] w-[330px]"><path d={Array.from({ length: 24 }, (_, i) => `${i ? "L" : "M"}${i * 14},${100 - (Math.sin(i * 0.6) * 22 + i * 1.4 + 30)}`).slice(0, Math.max(2, Math.floor(seg(t, 2.4, 4.6) * 24))).join(" ")} fill="none" stroke="hsl(14 88% 44%)" strokeWidth="3.5" strokeLinecap="round" /></svg>
      </Card>
    </Shell>
  );
}

/* ------------------------------------------------------------------- wizard */

export function Wizard({ t }: S) {
  const steps = ["Basics", "Problem", "Role", "Tech", "Pitch", "Review"];
  const cur = Math.min(5, Math.floor(t / 1.35));
  const lt = t - cur * 1.35;
  const body: Record<number, ReactNode> = {
    0: <><Field label="Venture name" value={typed("Illustrative Venture", lt, 0.2, 20)} caret className="left-8 right-8 top-8" /><p className="absolute left-8 top-[120px] text-[12px] font-semibold">Stage</p><div className="absolute left-8 top-[146px] flex gap-2">{["Idea", "Prototype", "MVP", "Growth"].map((s, i) => <Pill key={s} tone={i === 1 && lt > 0.7 ? "brand" : "muted"}>{s}</Pill>)}</div></>,
    1: <><Field label="What problem do you solve?" value={typed("Hiring relies on paperwork, not proof.", lt, 0.2, 26)} caret className="left-8 right-8 top-8" /><Field label="Your solution" value={typed("Short video proof, reviewed in one queue.", lt, 0.7, 26)} className="left-8 right-8 top-[120px]" /></>,
    2: <><Field label="Your role" value="CEO and Founder" className="left-8 right-8 top-8" /><p className="absolute left-8 top-[120px] text-[13px] text-muted-foreground">Lead founder</p></>,
    3: <><p className="absolute left-8 top-8 text-[12px] font-semibold">Industry and tech stack</p><div className="absolute left-8 right-8 top-[64px] flex flex-wrap gap-2">{["Fintech", "Education", "React", "Python", "AI"].map((s, i) => <Pill key={s} tone="soft" style={pop(lt, 0.15 + i * 0.16)}>{s}</Pill>)}</div></>,
    4: <><Vid className="left-8 top-8 h-[190px] w-[340px]" label="Pitch video" /><p className="absolute left-[390px] top-10 text-[14px] text-muted-foreground">Record or upload your pitch.</p></>,
    5: <><p className="absolute left-8 top-8 text-[18px] font-bold">Ready to submit</p>{["Basics", "Problem", "Role", "Tech", "Pitch"].map((s, i) => <p key={s} className="absolute left-8 flex items-center gap-2 text-[15px]" style={{ top: 72 + i * 30, ...pop(lt, 0.1 + i * 0.12) }}><Check className="h-4 w-4 text-[hsl(var(--brand-strong))]" />{s}</p>)}</>,
  };
  return (
    <Shell active={0} crumb="Venture Application">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Venture application</h3>
      <div className="absolute left-0 top-[66px] flex gap-2">
        {steps.map((s, i) => <Pill key={s} tone={i === cur ? "brand" : i < cur ? "soft" : "muted"}>{i < cur ? "✓ " : `${i + 1}. `}{s}</Pill>)}
      </div>
      <Card className="left-0 top-[118px] h-[400px] w-[900px]"><div className="relative h-full">{body[cur]}</div>
        <Btn primary className="absolute bottom-6 right-6 !px-8">{cur === 5 ? "Submit" : "Next"}</Btn>
      </Card>
      <Toast t={t} at={7.7}>Application submitted</Toast>
      <Cursor t={t} keys={[[0.3, 400, 300], ...[0, 1, 2, 3, 4].map((i): [number, number, number, 1] => [(i + 1) * 1.35 - 0.1, 865, 560, 1]), [7.5, 865, 560, 1]] as never} />
    </Shell>
  );
}

/* ----------------------------------------------------------------- challenge */

export function Challenge({ t }: S) {
  return (
    <Shell active={2} crumb="Challenges">
      <div className="flex items-center gap-3"><h3 className="text-[34px] font-bold tracking-tight text-foreground">Build a demo challenge</h3><Pill tone="soft" style={pop(t, 0.3)}>Open</Pill></div>
      <p className="text-[14px] text-muted-foreground">{typed("Show your idea in one short video.", t, 0.3, 30)}</p>
      <div className="absolute left-0 top-[86px] flex gap-2">{["Prize description", "Deadline", "Skills tags"].map((x, i) => <Pill key={x} style={pop(t, 1.0 + i * 0.2)}>{x}</Pill>)}</div>
      {Array.from({ length: 6 }, (_, i) => {
        const at = 1.6 + i * 0.5;
        const st = t > 5.6 && i === 2 ? "winner" : t > 4.0 + i * 0.25 && i < 4 ? "reviewed" : "submitted";
        return (
          <div key={i} className="absolute" style={{ left: (i % 3) * 300, top: 140 + Math.floor(i / 3) * 190, width: 280, height: 170, ...pop(t, at, 0.4) }}>
            <Vid className="inset-0" style={{ inset: 0, outline: st === "winner" ? "3px solid hsl(var(--brand-strong))" : "none" }} hue={i} label={`Entry ${i + 1}`} />
            <Pill tone={st === "winner" ? "brand" : st === "reviewed" ? "soft" : "muted"} style={{ position: "absolute", right: 10, top: 10 }}>{st}</Pill>
          </div>
        );
      })}
      <Card className="right-0 top-[86px] h-[240px] w-[0px] !p-0 opacity-0" />
      <Cursor t={t} keys={[[3.4, 900, 620], [4.2, 340, 320, 1], [5.4, 620, 320, 1]]} />
    </Shell>
  );
}

/* --------------------------------------------------------------- portfolio */

export function Portfolio({ t }: S) {
  return (
    <Shell active={6} crumb="Profile">
      <Card className="left-0 top-0 h-[150px] w-[900px]">
        <span className="squircle-icon absolute left-6 top-6 h-[90px] w-[90px] text-[32px] font-bold text-foreground">S</span>
        <p className="absolute left-[140px] top-8 text-[26px] font-bold text-foreground">Student portfolio</p>
        <div className="absolute left-[140px] top-[80px] flex gap-2">{["Design", "Research", "Video"].map((s, i) => <Pill key={s} tone="soft" style={pop(t, 0.5 + i * 0.2)}>{s}</Pill>)}</div>
        <div className="absolute right-6 top-8 flex items-center gap-3 text-[14px] font-semibold text-foreground">Public profile
          <span className={`flex h-7 w-12 items-center rounded-full px-1 ${t > 3.2 ? "bg-[hsl(var(--brand-strong))] justify-end" : "bg-foreground/25"}`}><span className="h-5 w-5 rounded-full bg-white" /></span>
        </div>
      </Card>
      {[0, 1, 2].map((i) => <Vid key={i} className="top-[180px] h-[200px] w-[285px]" style={{ left: i * 305, ...pop(t, 1 + i * 0.4, 0.5) }} hue={i} label={["Capstone", "Prototype", "Pitch"][i]} />)}
      <div className="neo-pressed absolute left-0 top-[410px] flex items-center gap-3 !rounded-full px-5 py-3 text-[14px] text-foreground" style={pop(t, 3.6)}>
        <Eye className="h-4 w-4" />donjo.example/your-name <Pill tone="soft">Shareable link</Pill>
      </div>
      <Cursor t={t} keys={[[0.4, 800, 500], [2.9, 1060, 110], [3.2, 1060, 110, 1]]} />
    </Shell>
  );
}

export function EmployerFeed({ t }: S) {
  const off = -easeInOut(seg(t, 0.6, 3.6)) * 210;
  return (
    <Shell active={0} crumb="Discover talent">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Discover talent</h3>
      <div className="absolute left-0 top-[64px] h-[450px] w-[940px] overflow-hidden">
        <div style={{ transform: `translateY(${off}px)` }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="neo-extruded-sm absolute flex h-[180px] w-[900px] items-center gap-6 !rounded-3xl p-4" style={{ top: i * 200, left: 0 }}>
              <Vid className="!relative !h-[148px] !w-[262px]" style={{ position: "relative", height: 148, width: 262 }} hue={i} label="Project walkthrough" />
              <div className="flex-1"><p className="text-[18px] font-bold text-foreground">Student {i + 1}</p><div className="mt-2 flex gap-2"><Pill tone="soft">Design</Pill><Pill>Research</Pill></div></div>
              <span className="squircle-icon h-12 w-12"><Heart className="h-5 w-5" style={{ color: i === 1 && t > 4.4 ? "hsl(14 88% 44%)" : undefined }} fill={i === 1 && t > 4.4 ? "currentColor" : "none"} /></span>
            </div>
          ))}
        </div>
      </div>
      <Toast t={t} at={4.6}>Saved to shortlist</Toast>
      <Cursor t={t} keys={[[0.3, 700, 450], [3.8, 862, 226], [4.4, 862, 226, 1]]} />
    </Shell>
  );
}

export function Messaging({ t }: S) {
  return (
    <Shell active={4} crumb="Messages">
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Messages</h3>
      <Card className="left-0 top-[64px] h-[470px] w-[900px]">
        <div className="absolute left-6 top-6 max-w-[520px] rounded-3xl rounded-bl-md bg-white/70 px-5 py-3.5 text-[16px] text-foreground" style={pop(t, 0.5)}>{typed("Loved your walkthrough. Free to chat this week?", t, 0.6, 30)}</div>
        <div className="absolute right-6 top-[110px] max-w-[420px] rounded-3xl rounded-br-md bg-[hsl(var(--brand-strong))] px-5 py-3.5 text-[16px] text-white" style={pop(t, 2.6)}>{typed("Yes, happy to. Thank you!", t, 2.7, 28)}</div>
        <div className="absolute left-6 top-[190px] max-w-[520px] rounded-3xl rounded-bl-md bg-white/70 px-5 py-3.5 text-[16px] text-foreground" style={pop(t, 4.2)}>{typed("Great. Sending a time now.", t, 4.3, 28)}</div>
        <div className="neo-inset absolute inset-x-6 bottom-6 flex h-14 items-center justify-between !rounded-full px-5 text-[15px] text-muted-foreground">Write a message...<Send className="h-5 w-5 text-[hsl(var(--brand-strong))]" /></div>
      </Card>
    </Shell>
  );
}

/* -------------------------------------------------------- roles / passkeys */

const roleRows: [string, boolean[]][] = [
  ["Talent", [true, false, false, false]], ["Employer", [false, true, true, false]], ["Founder", [true, false, false, false]],
  ["Investor", [false, false, true, false]], ["Judge", [false, false, true, false]], ["Admin", [false, true, true, true]],
];
export function Roles({ t }: S) {
  const cols = ["Record and apply", "Post jobs and challenges", "Review applicants", "Admin console"];
  return (
    <Shell active={6} crumb="Roles" admin>
      <h3 className="text-[34px] font-bold tracking-tight text-foreground">Role-based access</h3>
      <Card className="left-0 top-[64px] h-[470px] w-[930px]">
        <div className="absolute left-[190px] top-5 flex">{cols.map((c) => <span key={c} className="w-[180px] text-center text-[13px] font-semibold text-muted-foreground">{c}</span>)}</div>
        {roleRows.map(([r, on], i) => (
          <div key={r} className="absolute left-4 right-4 flex h-[56px] items-center rounded-2xl px-4" style={{ top: 66 + i * 64, ...pop(t, 0.3 + i * 0.25), background: Math.floor((t - 1.5) / 0.9) === i ? "hsl(var(--brand) / .12)" : "transparent" }}>
            <span className="w-[170px] text-[16px] font-semibold text-foreground">{r}</span>
            {on.map((v, j) => <span key={j} className="flex w-[180px] justify-center">{v ? <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--brand-strong))]" style={pop(t, 0.9 + i * 0.25 + j * 0.05, 0.25)}><Check className="h-4 w-4 text-white" /></span> : <span className="h-1.5 w-4 rounded bg-foreground/20" />}</span>)}
          </div>
        ))}
      </Card>
    </Shell>
  );
}

export function Passkey({ t }: S) {
  const sheet = easeOut(seg(t, 1.6, 2.2));
  const ok = t > 4.0;
  return (
    <div className="absolute inset-0 bg-[hsl(var(--background))]">
      <Card className="left-1/2 top-1/2 h-[470px] w-[520px]" style={{ transform: "translate(-50%,-50%)" }}>
        <p className="text-center text-[28px] font-bold text-foreground">Sign in to Donjo</p>
        <Field label="Email" value={typed("you@example.org", t, 0.3, 18)} className="left-8 right-8 top-[90px]" />
        <Btn primary className="absolute left-8 right-8 top-[190px] !py-4"><Fingerprint className="h-5 w-5" />Use a passkey</Btn>
        <p className="absolute left-8 right-8 top-[262px] text-center text-[13px] text-muted-foreground">Your fingerprint or face never leaves your device.</p>
        <div className="absolute left-1/2 top-[320px] -translate-x-1/2"><Pill tone="soft">In development</Pill></div>
      </Card>
      <div className="absolute inset-0 bg-foreground/30" style={{ opacity: sheet * (ok ? 0 : 1) }} />
      <div className="absolute left-1/2 top-1/2 flex h-[280px] w-[380px] -translate-x-1/2 flex-col items-center justify-center rounded-3xl bg-white text-center shadow-2xl" style={{ opacity: sheet * (ok ? 0 : 1), transform: `translate(-50%, ${-50 + (1 - sheet) * 20}%)` }}>
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--brand)/.16)]">
          <span className="absolute inset-0 rounded-full border-2 border-[hsl(var(--brand-strong))]" style={{ transform: `scale(${1 + (t % 1) * 0.5})`, opacity: 1 - (t % 1) }} />
          <Fingerprint className="h-9 w-9 text-[hsl(var(--brand-strong))]" />
        </span>
        <p className="mt-4 text-[20px] font-bold text-foreground">Confirm it's you</p>
        <p className="text-[14px] text-muted-foreground">Checked on this device</p>
      </div>
      {ok && (
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--background))]" style={{ opacity: easeOut(seg(t, 4.0, 4.5)) }}>
          <div className="text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--brand-strong))]"><ShieldCheck className="h-10 w-10 text-white" /></span><p className="mt-5 text-[30px] font-bold text-foreground">Signed in</p></div>
        </div>
      )}
      <Cursor t={t} keys={[[0.2, 900, 500], [1.4, 640, 330], [1.5, 640, 330, 1]]} />
    </div>
  );
}

