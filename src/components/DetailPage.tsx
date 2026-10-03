import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import Reveal from "./Reveal";
import { CtaBand, FaqList, SectionHeader } from "./PageBits";
import Trailer, { WatchTrailerButton } from "./trailer/Trailer";
import { BeforeAfter, Bento, Compare, DayTimeline, Permissions, Pinned, Roles, Stepper, StatusTable } from "./blocks";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/utils";
import type { DetailContent } from "@/data/types";
import type { BlockId, Cta, PageDesign } from "@/data/pageDesign";
import { designFor } from "@/data/pageDesign";
import { solutions } from "@/data/solutions";
import { platform } from "@/data/platform";

const allPages = [...solutions, ...platform];
const pathOf = (p: DetailContent) => `/${p.family}/${p.slug}`;

function PrimaryCta({ cta, dark }: { cta: Cta; dark?: boolean }) {
  const cls = cn("neo-pill inline-block", dark && "shadow-none");
  return cta.href ? <a href={cta.href} className={cls}>{cta.label}</a> : <Link to={cta.to ?? "/contact"} className={cls}>{cta.label}</Link>;
}

function SecondaryCta({ design, dark }: { design: PageDesign; dark?: boolean }) {
  const s = design.secondary;
  if (s.kind === "trailer") return <WatchTrailerButton id={design.trailer} label={s.label} className={dark ? "!text-white" : undefined} />;
  return (
    <a href={`#${s.target}`} className={cn("inline-flex items-center gap-2 py-3 text-sm font-semibold underline-offset-4 hover:underline", dark ? "text-white" : "text-foreground")}>
      {s.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function HeroText({ page, design, dark, center }: { page: DetailContent; design: PageDesign; dark?: boolean; center?: boolean }) {
  const Icon = page.icon;
  return (
    <div className={cn("space-y-6", center && "mx-auto max-w-3xl text-center")}>
      <div className={cn("flex items-center gap-3", center && "justify-center")}>
        <span className={cn("squircle-icon h-12 w-12", dark && "!bg-white/10 !shadow-none")}><Icon className={cn("h-5 w-5", dark ? "text-white" : "text-foreground")} strokeWidth={1.5} aria-hidden="true" /></span>
        <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm", dark ? "text-white/70" : "text-muted-foreground")}>{page.eyebrow}: {page.name}</p>
      </div>
      <h1 id="page-title" className={cn("text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl", dark ? "text-white" : "text-foreground")}>{page.headline}</h1>
      <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/75" : "text-muted-foreground")}>{page.subhead}</p>
      <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 pt-1", center && "justify-center")}>
        <PrimaryCta cta={design.primary} dark={dark} />
        <SecondaryCta design={design} dark={dark} />
      </div>
      <ul className={cn("flex flex-wrap gap-2 pt-1", center && "justify-center")}>
        {page.glance.items.map((g) => (
          <li key={g} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold", dark ? "bg-white/10 text-white/85" : "neo-pressed !rounded-full text-muted-foreground")}>{g}</li>
        ))}
      </ul>
    </div>
  );
}

function Hero({ page, design }: { page: DetailContent; design: PageDesign }) {
  const t = <Trailer id={design.trailer} noTranscript={false} />;
  switch (design.hero) {
    case "wide":
      return (
        <section className="space-y-10" aria-labelledby="page-title">
          <HeroText page={page} design={design} center />
          <div className="mx-auto max-w-5xl">{t}</div>
        </section>
      );
    case "cinematic":
      return (
        <section className="overflow-hidden rounded-[2rem] bg-[#12151b] p-6 sm:p-12 lg:p-16" aria-labelledby="page-title">
          <div className="space-y-10">
            <HeroText page={page} design={design} dark />
            <div className="[&_details]:text-white/70 [&_summary]:text-white">{t}</div>
          </div>
        </section>
      );
    case "reverse":
      return (
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-14" aria-labelledby="page-title">
          <div className="min-w-0 lg:col-span-3">{t}</div>
          <div className="min-w-0 lg:col-span-2"><HeroText page={page} design={design} /></div>
        </section>
      );
    case "minimal":
      return (
        <section className="neo-extruded grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-2" aria-labelledby="page-title">
          <HeroText page={page} design={design} />
          <div className="min-w-0">{t}</div>
        </section>
      );
    default:
      return (
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-14" aria-labelledby="page-title">
          <div className="min-w-0 lg:col-span-2"><HeroText page={page} design={design} /></div>
          <div className="min-w-0 lg:col-span-3">{t}</div>
        </section>
      );
  }
}

/** Solution and Platform detail pages: each page composes its own block order (data/pageDesign.ts). */
const DetailPage = ({ page }: { page: DetailContent }) => {
  const design = designFor(page.family, page.slug);
  usePageMeta(pathOf(page), { faq: page.faq });
  const related = page.related.map((path) => allPages.find((p) => pathOf(p) === path)).filter((p): p is DetailContent => Boolean(p));
  const props = { page, design };

  const blocks: Record<BlockId, React.ReactNode> = {
    beforeAfter: <BeforeAfter {...props} />,
    day: <DayTimeline {...props} />,
    bento: <Bento {...props} />,
    stepper: <Stepper {...props} />,
    roles: <Roles {...props} />,
    pinned: <Pinned {...props} />,
    compare: <Compare {...props} />,
    status: <StatusTable {...props} />,
    permissions: <Permissions />,
    faq: (
      <section id="faq" className="space-y-8" aria-labelledby="faq-title">
        <SectionHeader eyebrow="FAQ" title="Quick answers" id="faq-title" />
        <FaqList items={page.faq} />
      </section>
    ),
    related: (
      <section className="space-y-6" aria-labelledby="related-title">
        <SectionHeader title="Keep exploring" id="related-title" />
        <ul className="grid gap-6 md:grid-cols-3">
          {related.map((r) => {
            const RIcon = r.icon;
            return (
              <li key={pathOf(r)}>
                <Link to={pathOf(r)} className="neo-extruded-sm group flex h-full flex-col gap-3 p-6">
                  <RIcon className="h-5 w-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-lg font-bold text-foreground">{r.name}</span>
                  <span className="flex-1 text-sm text-muted-foreground">{r.summary}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    ),
    cta: <CtaBand title={design.closing.title} body={design.closing.body} primary={design.primary.to ? { label: design.primary.label, to: design.primary.to } : design.primary.href ? { label: design.primary.label, href: design.primary.href } : { label: "Contact us", to: "/contact" }} secondary={{ label: "See pricing", to: "/pricing" }} />,
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      <Hero {...props} />
      {page.statusNote && (
        <Reveal>
          <p className="neo-pressed mx-auto flex max-w-3xl items-start gap-3 p-4 text-sm text-muted-foreground sm:p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
            <span><strong className="font-semibold text-foreground">Availability:</strong> {page.statusNote}</span>
          </p>
        </Reveal>
      )}
      {design.layout.map((b) => (
        <div key={b}>{blocks[b]}</div>
      ))}
    </div>
  );
};

export default DetailPage;
