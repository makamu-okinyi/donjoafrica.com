import { Link } from "react-router-dom";
import { ArrowRight, Handshake } from "lucide-react";
import Reveal from "./Reveal";
import { SectionHeader } from "./PageBits";
import { usePublishedPartners } from "@/hooks/useSiteData";

interface PartnerWallProps {
  /** Where the "become a partner" CTA points. */
  ctaTo?: string;
  id?: string;
}

/**
 * "Our partners" logo wall. Renders only when the admin has published at least one partner;
 * otherwise a quiet "become our first partner" call to action (never placeholder logos).
 */
const PartnerWall = ({ ctaTo = "/partners#partner-form", id = "our-partners" }: PartnerWallProps) => {
  const { data } = usePublishedPartners();
  // Until partners load (and in the prerendered HTML) the quiet CTA is shown; it is swapped for the wall below the fold.
  const partners = data ?? [];

  if (partners.length === 0) {
    return (
      <Reveal>
        <section className="neo-pressed p-8 sm:p-10 text-center space-y-4" aria-labelledby={`${id}-cta`}>
          <Handshake className="w-6 h-6 mx-auto text-foreground" strokeWidth={1.5} aria-hidden="true" />
          <h2 id={`${id}-cta`} className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Become our first partner
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Help shape proof-based hiring in East Africa.
          </p>
          <Link to={ctaTo} className="neo-pill inline-block text-sm !px-8 !py-3">
            Partner With Us
          </Link>
        </section>
      </Reveal>
    );
  }

  return (
    <section className="space-y-8" aria-labelledby={id}>
      <SectionHeader align="center" eyebrow="Our partners" title="Working together" id={id} />
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((p, i) => {
          const inner = (
            <>
              {p.logoUrl ? (
                <img
                  src={p.logoUrl}
                  alt={p.name}
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-40 max-w-full object-contain"
                />
              ) : (
                <span className="text-base font-bold text-foreground text-center">{p.name}</span>
              )}
              <span className="text-xs text-muted-foreground">{p.sector}</span>
            </>
          );
          const cls = "neo-extruded-sm h-full min-h-32 p-5 flex flex-col items-center justify-center gap-3 text-center";
          return (
            <li key={p.id}>
              <Reveal delay={Math.min(i, 5) * 0.05} className="h-full">
                {p.website ? (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} hover:shadow-none transition-shadow`}
                    aria-label={`${p.name} (opens in a new tab)`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
      <p className="text-center">
        <Link to={ctaTo} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline">
          Partner with us <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
};

export default PartnerWall;
