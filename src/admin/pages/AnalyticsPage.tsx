import { useState } from "react";
import { useQuery } from "convex/react";
import { api, type PageProps } from "../api";
import { BarList, Btn, EmptyState, LineChart, PageHeader, Panel, Skeleton, Stat } from "../ui";
import { cn } from "@/lib/utils";

type Tally = { name: string; count: number }[];
interface Summary {
  hasData: boolean; truncated: boolean; rangeDays: number;
  totals: { pageviews: number; visitors: number; sessions: number; newVisitors: number; pagesPerSession: number; bounceRate: number; avgEngagedSeconds: number };
  series: { day: string; pageviews: number; visitors: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  referrers: Tally; campaigns: Tally; devices: Tally; browsers: Tally; operatingSystems: Tally; viewports: Tally; languages: Tally; countries: Tally;
  ctas: Tally; contactFunnel: { label: string; count: number }[]; partnerFunnel: { label: string; count: number }[];
  planInterest: { views: Tally; clicks: Tally };
}

function Funnel({ rows }: { rows: { label: string; count: number }[] }) {
  const top = Math.max(1, rows[0]?.count ?? 1);
  return (
    <ol className="space-y-3">
      {rows.map((r, i) => (
        <li key={r.label}>
          <div className="mb-1 flex justify-between text-sm"><span>{r.label}</span><span className="font-mono text-muted-foreground">{r.count}{i > 0 && rows[i - 1].count ? ` (${Math.round((r.count / rows[i - 1].count) * 100)}%)` : ""}</span></div>
          <div className="h-2.5 rounded-full bg-foreground/10"><div className="h-2.5 rounded-full bg-[hsl(var(--brand-strong))]" style={{ width: `${(r.count / top) * 100}%` }} /></div>
        </li>
      ))}
    </ol>
  );
}

export default function AnalyticsPage({ useMeta }: PageProps) {
  useMeta("Site analytics · Admin | Donjo");
  const [days, setDays] = useState(30);
  const s = useQuery(api.analytics.summary, { days }) as Summary | undefined;

  return (
    <>
      <PageHeader
        title="Site analytics"
        description="First-party and cookie-less. No IP addresses or personal data. Do Not Track is respected."
        actions={[7, 30, 90].map((d) => (
          <Btn key={d} variant={days === d ? "primary" : "secondary"} aria-pressed={days === d} onClick={() => setDays(d)}>{d} days</Btn>
        ))}
      />
      {!s ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : !s.hasData ? (
        <Panel><EmptyState title="No visits recorded yet">Once real visitors browse the public site (not bots, not Do Not Track), charts appear here.</EmptyState></Panel>
      ) : (
        <div className="space-y-6">
          {s.truncated && <p className="rounded-xl bg-amber-500/20 px-4 py-3 text-sm">Showing the most recent events only (query cap reached).</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Visitors" value={s.totals.visitors} hint={`${s.totals.newVisitors} new`} />
            <Stat label="Pageviews" value={s.totals.pageviews} hint={`${s.totals.pagesPerSession} per session`} />
            <Stat label="Bounce rate" value={`${s.totals.bounceRate}%`} hint="Single page, under 10s, no action" />
            <Stat label="Avg. engaged time" value={`${s.totals.avgEngagedSeconds}s`} hint="Per session" />
          </div>
          <Panel title="Visitors and pageviews"><LineChart data={s.series} /></Panel>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Top pages">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="pb-2 font-semibold">Page</th><th className="pb-2 text-right font-semibold">Views</th><th className="pb-2 text-right font-semibold">Visitors</th></tr></thead>
                <tbody>{s.topPages.map((p) => <tr key={p.path} className="border-t border-foreground/10"><td className="max-w-[16rem] truncate py-2">{p.path}</td><td className="py-2 text-right font-mono">{p.views}</td><td className="py-2 text-right font-mono">{p.visitors}</td></tr>)}</tbody>
              </table>
            </Panel>
            <Panel title="Referrers"><BarList rows={s.referrers} /></Panel>
            <Panel title="Campaigns (UTM)"><BarList rows={s.campaigns} empty="No tagged campaign traffic" /></Panel>
            <Panel title="Calls to action"><BarList rows={s.ctas} /></Panel>
            <Panel title="Contact form funnel"><Funnel rows={s.contactFunnel} /></Panel>
            <Panel title="Partner form funnel"><Funnel rows={s.partnerFunnel} /></Panel>
            <Panel title="Devices"><BarList rows={s.devices} /></Panel>
            <Panel title="Browsers"><BarList rows={s.browsers} /></Panel>
            <Panel title="Operating systems"><BarList rows={s.operatingSystems} /></Panel>
            <Panel title="Countries" description="Approximated from the browser time zone, not location."><BarList rows={s.countries} /></Panel>
            <Panel title="Screen size"><BarList rows={s.viewports} /></Panel>
            <Panel title="Languages"><BarList rows={s.languages} /></Panel>
          </div>
          <Panel title="Pricing plan interest" description="Plan card views and button clicks. Contact requests that mention a plan are on the Pricing page.">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className={cn("mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground")}>Card views</p><BarList rows={s.planInterest.views} empty="No plan views yet" /></div>
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Button clicks</p><BarList rows={s.planInterest.clicks} empty="No plan clicks yet" /></div>
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}
