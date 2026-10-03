import { SIGNUP_URL, SIGNUP_LABEL } from "@/lib/appUrl";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import type { FeatureStatus } from "@/data/types";

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.18em]">{children}</p>
);

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
}

/** Consistent heading block for a page section. */
export const SectionHeader = ({ eyebrow, title, intro, align = "left", id }: SectionHeaderProps) => (
  <Reveal className={`space-y-3 max-w-3xl ${align === "center" ? "text-center mx-auto" : ""}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 id={id} className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight text-balance">
      {title}
    </h2>
    {intro && <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{intro}</p>}
  </Reveal>
);

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children?: ReactNode;
}

/** Centered hero panel used on simple content pages. */
export const PageHero = ({ eyebrow, title, intro, children }: PageHeroProps) => (
  <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight text-balance">
      {title}
    </h1>
    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">{intro}</p>
    {children}
  </section>
);

const statusLabel: Record<Exclude<FeatureStatus, "live">, string> = {
  building: "In development",
  roadmap: "On the roadmap",
};

export const StatusBadge = ({ status }: { status?: FeatureStatus }) => {
  if (!status || status === "live") return null;
  return (
    <span className="neo-pressed inline-flex items-center px-3 py-1 text-xs font-semibold text-[hsl(var(--brand-ink))]">
      {statusLabel[status]}
    </span>
  );
};

interface FaqItem {
  q: string;
  a: string;
}

/** Accessible FAQ built on native details/summary. */
export const FaqList = ({ items }: { items: FaqItem[] }) => (
  <div className="space-y-3 max-w-3xl">
    {items.map((f, i) => (
      <Reveal key={f.q} delay={Math.min(i, 3) * 0.05}>
        <details className="group neo-extruded-sm !rounded-2xl open:shadow-none open:neo-pressed">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 text-left text-base font-semibold text-foreground rounded-2xl [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-5 sm:px-6 text-sm sm:text-base text-muted-foreground leading-relaxed">{f.a}</p>
        </details>
      </Reveal>
    ))}
  </div>
);

interface CtaBandProps {
  title: string;
  body: string;
  primary?: { label: string; to?: string; href?: string };
  secondary?: { label: string; to: string };
}

export const CtaBand = ({
  title,
  body,
  primary = { label: SIGNUP_LABEL, href: SIGNUP_URL },
  secondary,
}: CtaBandProps) => (
  <Reveal>
    <section className="neo-extruded p-6 sm:p-12 text-center space-y-6" aria-label="Get in touch">
      <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight text-balance">{title}</h2>
      <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{body}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {primary.href ? (
          <a href={primary.href} className="neo-pill inline-block">
            {primary.label}
          </a>
        ) : (
          <Link to={primary.to ?? "/contact"} className="neo-pill inline-block">
            {primary.label}
          </Link>
        )}
        {secondary && (
          <Link
            to={secondary.to}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline py-3"
          >
            {secondary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  </Reveal>
);
