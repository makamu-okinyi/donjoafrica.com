import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api, type PageProps } from "../api";
import { PageHeader, Panel, Skeleton, Stat } from "../ui";

interface Ov {
  visitors30: number; visitors7: number; pageviews30: number; consultations: number; consultationsNew: number;
  consultationsWeek: number; partnerRequests: number; partnerRequestsNew: number; partnerRequestsWeek: number; conversionRate: number;
}

export default function Overview({ useMeta }: PageProps) {
  useMeta("Overview · Admin | Donjo");
  const o = useQuery(api.analytics.overview) as Ov | undefined;
  const attention = o ? [
    o.consultationsNew > 0 && { to: "/admin/leads", text: `${o.consultationsNew} new lead${o.consultationsNew > 1 ? "s" : ""} waiting for a reply` },
    o.partnerRequestsNew > 0 && { to: "/admin/partners", text: `${o.partnerRequestsNew} partnership request${o.partnerRequestsNew > 1 ? "s" : ""} to review` },
  ].filter(Boolean) as { to: string; text: string }[] : [];

  return (
    <>
      <PageHeader title="Overview" description="What's happening on donjoafrica.com. Analytics are first-party and cookie-less." />
      {!o ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Visitors (30 days)" value={o.visitors30} hint={`${o.visitors7} in the last 7 days`} />
            <Stat label="Pageviews (30 days)" value={o.pageviews30} />
            <Stat label="Conversion rate" value={`${o.conversionRate}%`} hint="Leads and partner requests per visitor, 30 days" />
            <Stat label="Consultation requests" value={o.consultations} hint={`${o.consultationsWeek} new this week`} tone={o.consultationsNew ? "attention" : undefined} />
            <Stat label="Partner requests" value={o.partnerRequests} hint={`${o.partnerRequestsWeek} new this week`} tone={o.partnerRequestsNew ? "attention" : undefined} />
            <Stat label="New this week" value={o.consultationsWeek + o.partnerRequestsWeek} hint="Leads and partner requests combined" />
          </div>
          <Panel title="Needs attention" className="mt-6">
            {attention.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing waiting. New leads and partner requests will appear here.</p>
            ) : (
              <ul className="divide-y divide-foreground/10">
                {attention.map((a) => (
                  <li key={a.to}><Link to={a.to} className="flex items-center justify-between gap-3 py-3 text-sm font-medium text-foreground hover:underline">{a.text}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      )}
    </>
  );
}
