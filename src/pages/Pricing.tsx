import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individual founders exploring proof-based hiring.",
    features: [
      "Up to 25 applicant profiles",
      "Video portfolio viewing",
      "Basic Skill Radar",
      "Email support",
    ],
  },
  {
    name: "Venture",
    price: "$99",
    period: "/month",
    description: "For startups and accelerators scaling their talent pipeline.",
    features: [
      "Unlimited applicant profiles",
      "Full Skill Radar analytics",
      "Dossier generation (PDF export)",
      "Venture Velocity metrics",
      "Geospatial talent mapping",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large cohorts, accelerators, and venture studios.",
    features: [
      "Everything in Venture",
      "Bulk dossier generation (150+)",
      "Custom branding & white-label",
      "API access & integrations",
      "Dedicated account manager",
      "SLA & uptime guarantees",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your hiring pipeline. Scale as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`neo-extruded p-6 sm:p-8 space-y-6 flex flex-col ${plan.popular ? "ring-2 ring-foreground/20" : ""}`}
          >
            {plan.popular && (
              <span className="neo-pressed px-4 py-1.5 text-xs font-semibold text-foreground self-start">
                Most Popular
              </span>
            )}
            <div>
              <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" strokeWidth={2} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className={`text-center ${plan.popular ? "neo-pill" : "neo-extruded-sm px-6 py-3 font-semibold text-sm text-foreground hover:text-foreground/80 transition-colors"}`}
              style={!plan.popular ? { borderRadius: "9999px" } : undefined}
            >
              {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
