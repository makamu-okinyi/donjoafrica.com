import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CtaBand, FaqList, PageHero, SectionHeader } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePricingPlans } from "@/hooks/useSiteData";
import { formatPrice, type PricingPlan } from "@/data/pricing";

const faq = [
  { q: "Can I start for free?", a: "Yes. Starter is free for up to 25 applicant profiles." },
  { q: "Why is Enterprise unpriced?", a: "Volume, reviewers and integrations vary. We quote what fits." },
  { q: "How do I pay?", a: "List prices are in US dollars. We confirm payment options when you get in touch." },
  { q: "Do universities and hackathons pay the same?", a: "Talk to us. We'll scope a plan around your programme." },
];

/** Features a plan gets, including those inherited via an "Everything in X" line. */
function effectiveFeatures(plans: PricingPlan[], plan: PricingPlan): string[] {
  const out: string[] = [];
  for (const f of plan.features) {
    const m = f.match(/^Everything in (.+)$/i);
    const base = m && plans.find((p) => p.name.toLowerCase() === m[1].trim().toLowerCase());
    if (base && base !== plan) out.push(...effectiveFeatures(plans, base));
    else if (!m) out.push(f);
  }
  return out;
}

const Pricing = () => {
  usePageMeta("/pricing", { faq });
  const { data } = usePricingPlans();
  const plans = data ?? [];
  const perPlan = plans.map((p) => new Set(effectiveFeatures(plans, p)));
  const rows = Array.from(new Set(plans.flatMap((p) => effectiveFeatures(plans, p))));

  return (
    <div className="space-y-20 sm:space-y-28">
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        intro="Start free. Upgrade when your pipeline grows."
      />

      <section aria-label="Plans">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => {
            const price = formatPrice(plan);
            return (
              <li key={plan.slug}>
                <Reveal
                  delay={i * 0.08}
                  className={`neo-extruded p-6 sm:p-8 space-y-6 flex flex-col h-full ${plan.highlighted ? "ring-2 ring-[hsl(var(--brand-strong))]/50" : ""}`}
                >
                  {plan.highlighted && (
                    <span className="neo-pressed px-4 py-1.5 text-xs font-semibold text-foreground self-start">Most popular</span>
                  )}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{plan.tagline}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground tracking-tight">{price.amount}</span>
                    <span className="text-sm text-muted-foreground">{price.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--brand-ink))] mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.ctaHref}
                    className={`text-center ${plan.highlighted ? "neo-pill" : "neo-extruded-sm !rounded-full px-6 py-3.5 font-semibold text-sm text-foreground hover:shadow-none transition-shadow"}`}
                  >
                    {plan.ctaLabel}
                    <span className="sr-only"> with the {plan.name} plan</span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-10" aria-labelledby="compare-title">
        <SectionHeader align="center" eyebrow="Compare" title="What's in each plan" id="compare-title" />
        <Reveal>
          <div className="relative neo-extruded p-2 sm:p-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left border-collapse">
              <caption className="sr-only">Feature comparison between plans</caption>
              <thead>
                <tr>
                  <th scope="col" className="p-4 text-sm font-semibold text-foreground">Feature</th>
                  {plans.map((p) => (
                    <th key={p.slug} scope="col" className="p-4 text-sm font-semibold text-foreground text-center">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row} className="border-t border-foreground/10">
                    <th scope="row" className="p-4 text-sm font-medium text-muted-foreground">{row}</th>
                    {perPlan.map((set, i) => (
                      <td key={plans[i].slug} className="p-4 text-center">
                        {set.has(row) ? (
                          <>
                            <Check className="w-4 h-4 mx-auto text-[hsl(var(--brand-ink))]" strokeWidth={2.5} aria-hidden="true" />
                            <span className="sr-only">Included</span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
                            <span className="sr-only">Not included</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="space-y-10" aria-labelledby="pfaq-title">
        <SectionHeader eyebrow="FAQ" title="Pricing questions" id="pfaq-title" />
        <FaqList items={faq} />
      </section>

      <CtaBand
        title="Not sure which plan fits?"
        body="Tell us about your team. We'll suggest the simplest option."
        primary={{ label: "Talk to Us", to: "/contact" }}
        secondary={{ label: "Explore solutions", to: "/solutions" }}
      />
    </div>
  );
};

export default Pricing;
