import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { api, type PageProps } from "../api";
import { Badge, Btn, Confirm, Dialog, EmptyState, PageHeader, Panel, Skeleton, useAction } from "../ui";
import { Field, Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import PlanCard from "@/components/PlanCard";
import type { BillingPeriod, PricingPlan } from "@/data/pricing";

interface Row { _id: string; slug: string; name: string; tagline: string; priceAmount?: number; currency: string; billingPeriod: BillingPeriod; features: string[]; limits?: Record<string, number>; highlighted: boolean; ctaLabel: string; ctaHref: string; isPublished: boolean; order: number }
interface Summary { planInterest: { views: { name: string; count: number }[]; clicks: { name: string; count: number }[] } }
interface Lead { brief: string }

const blank: Omit<Row, "_id" | "order"> = { slug: "", name: "", tagline: "", priceAmount: undefined, currency: "USD", billingPeriod: "monthly", features: [""], highlighted: false, ctaLabel: "Get Started", ctaHref: "/contact", isPublished: false };

const toPlan = (r: Omit<Row, "_id" | "order">): PricingPlan => ({
  slug: r.slug || "new", name: r.name || "Plan name", tagline: r.tagline, priceAmount: r.priceAmount ?? null, currency: r.currency,
  billingPeriod: r.billingPeriod, features: r.features.filter((f) => f.trim()), limits: r.limits ?? {}, highlighted: r.highlighted, ctaLabel: r.ctaLabel || "Get Started", ctaHref: r.ctaHref,
});

export default function PricingAdmin({ useMeta }: PageProps) {
  useMeta("Pricing · Admin | Donjo");
  const plans = useQuery(api.pricing.adminList) as Row[] | undefined;
  const stats = useQuery(api.analytics.summary, { days: 30 }) as Summary | undefined;
  const leads = useQuery(api.consultations.list) as Lead[] | undefined;
  const create = useMutation(api.pricing.adminCreate);
  const update = useMutation(api.pricing.adminUpdate);
  const setPub = useMutation(api.pricing.adminSetPublished);
  const move = useMutation(api.pricing.adminMove);
  const del = useMutation(api.pricing.adminDelete);
  const run = useAction();
  const [edit, setEdit] = useState<(Omit<Row, "_id" | "order"> & { _id?: string }) | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const interest = (slug: string) => ({
    views: stats?.planInterest.views.find((x) => x.name === slug)?.count ?? 0,
    clicks: stats?.planInterest.clicks.find((x) => x.name === slug)?.count ?? 0,
    leads: (leads ?? []).filter((l) => l.brief.toLowerCase().includes(`[plan: ${slug}]`)).length,
  });

  const save = async () => {
    if (!edit) return;
    const { _id, ...f } = edit;
    // Send only the editable fields (the row also carries _creationTime, order, updatedAt).
    const body = { slug: f.slug, name: f.name, tagline: f.tagline, currency: f.currency, billingPeriod: f.billingPeriod, limits: f.limits, highlighted: f.highlighted, ctaLabel: f.ctaLabel, ctaHref: f.ctaHref, isPublished: f.isPublished, features: f.features.map((x) => x.trim()).filter(Boolean), priceAmount: f.billingPeriod === "free" || f.billingPeriod === "custom" ? undefined : f.priceAmount };
    let ok = true;
    await run(async () => { try { await (_id ? update({ id: _id, ...body }) : create(body)); } catch (e) { ok = false; throw e; } }, _id ? "Plan updated. The public page updates immediately." : "Plan created");
    if (ok) setEdit(null);
  };

  return (
    <>
      <PageHeader title="Pricing" description="The plans on the public Pricing page. Changes go live immediately when published." actions={<Btn variant="primary" onClick={() => setEdit({ ...blank })}><Plus className="h-4 w-4" aria-hidden="true" />New plan</Btn>} />
      {!plans ? <Skeleton className="h-40" /> : plans.length === 0 ? (
        <Panel><EmptyState title="No plans in the database">The public page shows the built-in default plans until you add one. Run <code>npx convex run pricing:seed</code> to load the defaults.</EmptyState></Panel>
      ) : (
        <ul className="space-y-4">
          {plans.map((p, i) => {
            const it = interest(p.slug);
            return (
              <li key={p._id}>
                <Panel>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-foreground">{p.name} <span className="font-mono text-sm font-normal text-muted-foreground">/{p.slug}</span></p>
                      <p className="text-sm text-muted-foreground">{p.billingPeriod === "free" ? "Free" : p.billingPeriod === "custom" ? "Custom" : `${p.currency} ${p.priceAmount} per ${p.billingPeriod === "yearly" ? "year" : "month"}`} · {p.features.length} features</p>
                      <div className="mt-2 flex flex-wrap gap-2"><Badge tone={p.isPublished ? "good" : "neutral"}>{p.isPublished ? "Published" : "Hidden"}</Badge>{p.highlighted && <Badge tone="brand">Highlighted</Badge>}</div>
                      <p className="mt-3 text-xs text-muted-foreground">Last 30 days: {it.views} card views, {it.clicks} button clicks, {it.leads} contact request{it.leads === 1 ? "" : "s"} naming this plan.</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Btn aria-label="Move up" disabled={i === 0} onClick={() => run(() => move({ id: p._id, direction: "up" }))} className="!w-10 !px-0"><ArrowUp className="h-4 w-4" /></Btn>
                      <Btn aria-label="Move down" disabled={i === plans.length - 1} onClick={() => run(() => move({ id: p._id, direction: "down" }))} className="!w-10 !px-0"><ArrowDown className="h-4 w-4" /></Btn>
                      <Btn onClick={() => run(() => setPub({ id: p._id, isPublished: !p.isPublished }), p.isPublished ? "Plan hidden" : "Plan published")}>{p.isPublished ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}{p.isPublished ? "Hide" : "Publish"}</Btn>
                      <Btn onClick={() => setEdit({ ...p, features: p.features.length ? p.features : [""] })}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Btn>
                      <Btn aria-label={`Delete ${p.name}`} variant="ghost" className="!w-10 !px-0 text-red-800" onClick={() => setDeleting(p)}><Trash2 className="h-4 w-4" /></Btn>
                    </div>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit?._id ? `Edit ${edit.name}` : "New plan"} wide>
        {edit && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>{(p) => <Input {...p} maxLength={60} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />}</Field>
                <Field label="Slug" required helper="Lowercase, used in links">{(p) => <Input {...p} maxLength={40} value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value.toLowerCase() })} />}</Field>
              </div>
              <Field label="Tagline">{(p) => <Input {...p} maxLength={160} value={edit.tagline} onChange={(e) => setEdit({ ...edit, tagline: e.target.value })} />}</Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Billing">{(p) => <Select {...p} value={edit.billingPeriod} onChange={(v) => setEdit({ ...edit, billingPeriod: v as BillingPeriod })} options={[{ value: "free", label: "Free" }, { value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" }, { value: "custom", label: "Custom quote" }]} />}</Field>
                <Field label="Price">{(p) => <Input {...p} type="number" inputMode="decimal" min={0} disabled={edit.billingPeriod === "free" || edit.billingPeriod === "custom"} value={edit.priceAmount ?? ""} onChange={(e) => setEdit({ ...edit, priceAmount: e.target.value === "" ? undefined : Number(e.target.value) })} />}</Field>
                <Field label="Currency">{(p) => <Input {...p} maxLength={3} value={edit.currency} onChange={(e) => setEdit({ ...edit, currency: e.target.value.toUpperCase() })} />}</Field>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold">Features</p>
                <ul className="space-y-2">
                  {edit.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <Input aria-label={`Feature ${i + 1}`} maxLength={120} value={f} onChange={(e) => setEdit({ ...edit, features: edit.features.map((x, k) => (k === i ? e.target.value : x)) })} />
                      <Btn aria-label={`Remove feature ${i + 1}`} variant="ghost" className="!w-10 shrink-0 !px-0" onClick={() => setEdit({ ...edit, features: edit.features.filter((_, k) => k !== i) })}><X className="h-4 w-4" /></Btn>
                    </li>
                  ))}
                </ul>
                <Btn className="mt-2" disabled={edit.features.length >= 15} onClick={() => setEdit({ ...edit, features: [...edit.features, ""] })}><Plus className="h-4 w-4" aria-hidden="true" />Add feature</Btn>
                <p className="mt-1 text-xs text-muted-foreground">Start a line with "Everything in Venture" to inherit that plan's features in the comparison table.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Button label">{(p) => <Input {...p} maxLength={40} value={edit.ctaLabel} onChange={(e) => setEdit({ ...edit, ctaLabel: e.target.value })} />}</Field>
                <Field label="Button link" helper="/contact or https://...">{(p) => <Input {...p} maxLength={200} value={edit.ctaHref} onChange={(e) => setEdit({ ...edit, ctaHref: e.target.value })} />}</Field>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-5 w-5 accent-[hsl(var(--brand-strong))]" checked={edit.highlighted} onChange={(e) => setEdit({ ...edit, highlighted: e.target.checked })} />Highlight as "Most popular"</label>
              <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" className="h-5 w-5 accent-[hsl(var(--brand-strong))]" checked={edit.isPublished} onChange={(e) => setEdit({ ...edit, isPublished: e.target.checked })} />Published on the site</label>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Live preview</p>
              <div className="max-w-sm"><PlanCard plan={toPlan(edit)} preview /></div>
            </div>
            <div className="flex justify-end gap-2 lg:col-span-2"><Btn onClick={() => setEdit(null)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save plan</Btn></div>
          </div>
        )}
      </Dialog>
      <Confirm open={!!deleting} title="Delete plan?" body={`${deleting?.name ?? "This plan"} will be removed from the database. This can't be undone.`} confirmLabel="Delete" danger onConfirm={() => deleting && run(() => del({ id: deleting._id }), "Plan deleted")} onClose={() => setDeleting(null)} />
    </>
  );
}
