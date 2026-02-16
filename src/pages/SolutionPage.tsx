import { Link, useParams, Navigate } from "react-router-dom";
import { Scissors, Stethoscope, Hotel, ShoppingCart, Check } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface SolutionData {
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
  features: string[];
}

const solutions: Record<string, SolutionData> = {
  salons: {
    icon: Scissors,
    title: "Siohioma for Salons",
    headline: "Manage your beauty services with elegance",
    description: "Complete management solution for service scheduling, client tracking, and beautiful reporting. Built specifically for beauty & wellness businesses.",
    features: [
      "Appointment scheduling & reminders",
      "Service menu management",
      "Client profiles & visit history",
      "Commission tracking for stylists",
      "Real-time inventory for products",
      "Revenue & analytics dashboards",
      "Staff management & payroll",
    ],
  },
  clinics: {
    icon: Stethoscope,
    title: "Siohioma for Clinics",
    headline: "Healthcare operations, simplified",
    description: "Streamline patient workflows, billing, and pharmacy inventory with a HIPAA-conscious platform built for clinics and medical practices.",
    features: [
      "Patient records management",
      "Appointment booking & workflows",
      "Billing & insurance processing",
      "Pharmacy inventory tracking",
      "Lab result integration",
      "Staff scheduling & payroll",
      "Compliance reporting",
    ],
  },
  hotels: {
    icon: Hotel,
    title: "Siohioma for Hotels",
    headline: "Hospitality management, elevated",
    description: "From room reservations to housekeeping workflows, manage every aspect of your hotel or lodge from a single dashboard.",
    features: [
      "Room booking & availability",
      "Guest check-in/check-out",
      "Housekeeping task management",
      "Restaurant POS integration",
      "Revenue & occupancy dashboards",
      "Staff management & shifts",
      "Expense tracking",
    ],
  },
  retail: {
    icon: ShoppingCart,
    title: "Siohioma for Retail",
    headline: "Manage your business with precision",
    description: "Complete POS solution with inventory tracking, customer management, and beautiful reporting. Built for hardware stores, supermarkets, and retail outlets.",
    features: [
      "Point-of-sale terminals",
      "Real-time stock tracking",
      "Purchase order management",
      "Supplier directory & ordering",
      "Deni (credit) management",
      "Smart analytics & KPIs",
      "Multi-branch support",
    ],
  },
};

const SolutionPage = () => {
  const { sector } = useParams<{ sector: string }>();
  const data = sector ? solutions[sector] : undefined;

  if (!data) return <Navigate to="/" replace />;

  const Icon = data.icon;

  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl space-y-8">
          <div className="squircle-icon w-16 h-16">
            <Icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
            {data.headline}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="neo-pressed px-4 py-2 text-xs font-medium text-muted-foreground">Real-time inventory</span>
            <span className="neo-pressed px-4 py-2 text-xs font-medium text-muted-foreground">Smart analytics</span>
          </div>
          <Link to="/contact" className="neo-pill inline-block">
            Book a Demo
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.features.map((f) => (
            <div key={f} className="neo-extruded-sm p-5 flex items-start gap-4">
              <Check className="w-5 h-5 text-foreground mt-0.5 shrink-0" strokeWidth={2} />
              <span className="text-sm text-muted-foreground">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          See how {data.title.replace("Siohioma for ", "")} businesses are already using Siohioma to grow.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Book a Demo
        </Link>
      </section>
    </div>
  );
};

export default SolutionPage;
