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
    tagline: "For individual founders exploring proof-based hiring.",
    priceAmount: null,
    currency: "USD",
    billingPeriod: "free",
    features: ["Up to 25 applicant profiles", "Video portfolio viewing", "Skill and industry tagging", "Email support"],
    limits: { profiles: 25 },
    highlighted: false,
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "venture",
    name: "Venture",
    tagline: "For startups and accelerators scaling their talent pipeline.",
    priceAmount: 99,
    currency: "USD",
    billingPeriod: "monthly",
    features: [
      "Unlimited applicant profiles",
      "Cohort skill radar",
      "Dossier generation (PDF export)",
      "Venture Velocity analytics",
      "County-level applicant map (in development)",
      "Priority support",
    ],
    limits: {},
    highlighted: true,
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    tagline: "For large cohorts, accelerators, universities and venture studios.",
    priceAmount: null,
    currency: "USD",
    billingPeriod: "custom",
    features: [
      "Everything in Venture",
      "Dossier export for large cohorts",
      "Custom branding, scoped with our team",
      "Integrations, scoped with our team",
      "Dedicated account manager",
      "Service terms agreed in contract",
    ],
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
