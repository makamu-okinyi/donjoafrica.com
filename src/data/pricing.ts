export type BillingPeriod = "monthly" | "yearly" | "custom" | "free";

export interface PricingPlan {
  slug: string;
  name: string;
  tagline: string;
  priceAmount: number | null;
  currency: string;
  billingPeriod: BillingPeriod;
  features: string[];
  limits: Record<string, number>;
  highlighted: boolean;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Default plans. Baked into the prerendered HTML so search engines see real content, then
 * replaced by the admin-managed `pricingPlans` table once Convex responds.
 * Keep in sync with convex/pricing.ts (seed).
 */
export const DEFAULT_PLANS: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "For small teams trying proof-based hiring.",
    priceAmount: null,
    currency: "USD",
    billingPeriod: "free",
    features: ["Post jobs with a video question", "Watch applicants' video portfolios", "Shortlist or reject, with private notes", "Skill tags and a skill match on every applicant", "Applicant dossier, reviewer ratings and radar", "PDF and CSV export of applicants"],
    limits: {},
    highlighted: false,
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "venture",
    name: "Venture",
    tagline: "For startups and accelerators with a growing pipeline.",
    priceAmount: 99,
    currency: "USD",
    billingPeriod: "monthly",
    features: ["Everything in Starter", "Higher limits on active jobs, challenges and shortlist size", "Plan set up and invoiced directly by our team"],
    limits: {},
    highlighted: true,
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    tagline: "For large cohorts, universities and venture studios.",
    priceAmount: null,
    currency: "USD",
    billingPeriod: "custom",
    features: ["Everything in Venture", "Limits and terms agreed with you in writing"],
    limits: {},
    highlighted: false,
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
  },
];

export function formatPrice(plan: PricingPlan): { amount: string; period: string } {
  if (plan.billingPeriod === "free") return { amount: "Free", period: "" };
  if (plan.billingPeriod === "custom" || plan.priceAmount == null) return { amount: "Custom", period: "" };
  const symbol = plan.currency === "USD" ? "$" : `${plan.currency} `;
  return {
    amount: `${symbol}${plan.priceAmount.toLocaleString("en-US")}`,
    period: plan.billingPeriod === "yearly" ? "/year" : "/month",
  };
}
