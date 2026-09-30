import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, UserCog, EyeOff, Video, ClipboardCheck, BarChart3, FileText } from "lucide-react";
import Reveal from "@/components/Reveal";
import LegacyHashRedirect from "@/components/LegacyHashRedirect";
import { CtaBand, PageHero, SectionHeader, StatusBadge } from "@/components/PageBits";
import Trailer from "@/components/trailer/Trailer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { platform } from "@/data/platform";

const flow = [
  { icon: Video, title: "Capture", body: "Applicants record proof clips against a prompt you set." },
  { icon: ClipboardCheck, title: "Review", body: "Reviewers watch, shortlist or reject from one queue." },
  { icon: FileText, title: "Share", body: "Export a dossier for panels who prefer a document." },
  { icon: BarChart3, title: "Understand", body: "Read the shape and speed of the pipeline in analytics." },
];

const trust = [
  {
    icon: Fingerprint,
    title: "Passkey sign-in",
    body: "Sign in with a device biometric instead of a password.",
    status: "building" as const,
  },
  {
    icon: UserCog,
    title: "Role-based access",
    body: "Six roles, each seeing only what it needs.",
  },
  {
    icon: EyeOff,
    title: "Applicant-controlled visibility",
    body: "Applicants choose public or private. Analytics are admin-only.",
  },
];

const Platform = () => {
  usePageMeta("/platform");
  return (
    <div className="space-y-20 sm:space-y-28">
      <LegacyHashRedirect />

      <PageHero
        eyebrow="Platform"
        title="The Venture Engine in four parts."
        intro="Show, review, share and measure, on one set of data."
      />

      <section className="space-y-8" aria-labelledby="plat-reel">
        <SectionHeader align="center" eyebrow="The reel" title="Four parts in under twenty seconds" id="plat-reel" />
        <div className="mx-auto max-w-5xl"><Trailer id="platform" /></div>
      </section>

      <section className="space-y-10" aria-labelledby="plat-list">
        <SectionHeader align="center" eyebrow="Features" title="What's inside" id="plat-list" />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platform.map((p, i) => {
            const Icon = p.icon;
            const badge = p.capabilities.some((c) => c.status === "building") ? "building" : p.capabilities.some((c) => c.status === "roadmap") ? "roadmap" : undefined;
            return (
              <li key={p.slug}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <Link
                    to={`/platform/${p.slug}`}
                    className="group neo-extruded h-full p-6 sm:p-10 flex flex-col gap-5 hover:shadow-none transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="squircle-icon w-14 h-14">
                        <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <StatusBadge status={badge} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{p.name}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{p.summary}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="plat-flow">
        <SectionHeader
          align="center"
          eyebrow="How the parts fit"
          title="From proof to insight"
          id="plat-flow"
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flow.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={f.title}>
                <Reveal delay={i * 0.06} className="neo-extruded-sm p-6 space-y-3 h-full">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-ink))]">0{i + 1}</span>
                    <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="security" className="scroll-mt-28 space-y-10" aria-labelledby="plat-security">
        <SectionHeader
          align="center"
          eyebrow="Security and access"
          title="Careful with applicant data"
          id="plat-security"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trust.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.title} delay={i * 0.08} className="neo-extruded p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="squircle-icon w-12 h-12">
                    <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="See it on your own use case"
        body="Tell us what you select for. We'll show what matters."
        secondary={{ label: "Browse solutions", to: "/solutions" }}
      />
    </div>
  );
};

export default Platform;
