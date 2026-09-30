import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, type PricingPlan } from "@/data/pricing";

/** One pricing card. Used by the public Pricing page and the admin live preview so they always match. */
const PlanCard = ({ plan, preview }: { plan: PricingPlan; preview?: boolean }) => {
  const price = formatPrice(plan);
  const to = plan.ctaHref.startsWith("/") ? `${plan.ctaHref}${plan.ctaHref.includes("?") ? "&" : "?"}plan=${plan.slug}` : plan.ctaHref;
  const cls = plan.highlighted ? "neo-pill" : "neo-extruded-sm !rounded-full px-6 py-3.5 font-semibold text-sm text-foreground hover:shadow-none transition-shadow";
  return (
    <div className={cn("neo-extruded flex h-full flex-col space-y-6 p-6 sm:p-8", plan.highlighted && "ring-2 ring-[hsl(var(--brand-strong))]/50")}>
      {plan.highlighted && <span className="neo-pressed self-start px-4 py-1.5 text-xs font-semibold text-foreground">Most popular</span>}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">{price.amount}</span>
        <span className="text-sm text-muted-foreground">{price.period}</span>
      </div>
      <ul className="flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-ink))]" strokeWidth={2.5} aria-hidden="true" />{f}
          </li>
        ))}
      </ul>
      {preview ? (
        <span className={cn("text-center", cls)}>{plan.ctaLabel}</span>
      ) : (
        <Link to={to} data-track={`plan_cta:${plan.slug}`} className={cn("text-center", cls)}>
          {plan.ctaLabel}<span className="sr-only"> with the {plan.name} plan</span>
        </Link>
      )}
    </div>
  );
};

export default PlanCard;
