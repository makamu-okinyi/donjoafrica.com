import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "KES 35,000",
    period: "/month",
    description: "Everything a single-shop business needs to run smoothly.",
    features: [
      "Unlimited users",
      "Full POS & invoicing",
      "Real-time inventory tracking",
      "Customer & supplier directory",
      "Payroll & commissions",
      "Smart analytics dashboard",
      "Email & WhatsApp support",
    ],
  },
  {
    name: "Professional",
    price: "KES 55,000",
    period: "/month",
    description: "For multi-location businesses and complex operations.",
    features: [
      "Everything in Standard",
      "Multi-branch management",
      "Inter-branch stock transfers",
      "Role-based access control",
      "Advanced reporting & KPIs",
      "Dedicated account manager",
      "Priority support & training",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale operations.",
    features: [
      "Everything in Professional",
      "Custom integrations & API access",
      "White-label options",
      "SLA & uptime guarantees",
      "On-site deployment & training",
      "24/7 dedicated support",
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
          Choose the plan that fits your business. Upgrade or downgrade anytime.
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
              {plan.price === "Custom" ? "Contact Sales" : "Book a Demo"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
