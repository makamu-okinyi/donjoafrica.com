import { Link } from "react-router-dom";
import { Scissors, Stethoscope, Hotel, ShoppingCart, Check } from "lucide-react";

const sectors = [
  {
    id: "salons",
    icon: Scissors,
    title: "Siohioma for Salons",
    tagline: "Manage your beauty services with elegance",
    description:
      "Complete management solution for service scheduling, client tracking, and beautiful reporting. Built specifically for beauty & wellness businesses.",
    highlights: [
      "Appointment scheduling & reminders",
      "Service menu management",
      "Client profiles & visit history",
      "Commission tracking for stylists",
      "Real-time inventory for products",
    ],
  },
  {
    id: "clinics",
    icon: Stethoscope,
    title: "Siohioma for Clinics",
    tagline: "Healthcare operations, simplified",
    description:
      "Streamline patient workflows, billing, and pharmacy inventory with a HIPAA-conscious platform built for clinics and medical practices.",
    highlights: [
      "Patient records management",
      "Appointment booking & workflows",
      "Billing & insurance processing",
      "Pharmacy inventory tracking",
      "Lab result integration",
    ],
  },
  {
    id: "hotels",
    icon: Hotel,
    title: "Siohioma for Hotels",
    tagline: "Hospitality management, elevated",
    description:
      "From room reservations to housekeeping workflows, manage every aspect of your hotel or lodge from a single dashboard.",
    highlights: [
      "Room booking & availability",
      "Guest check-in/check-out",
      "Housekeeping task management",
      "Restaurant POS integration",
      "Revenue & occupancy dashboards",
    ],
  },
  {
    id: "retail",
    icon: ShoppingCart,
    title: "Siohioma for Retail",
    tagline: "Manage your business with precision",
    description:
      "Complete POS solution with inventory tracking, customer management, and beautiful reporting. Built for hardware stores, supermarkets, and retail outlets.",
    highlights: [
      "Point-of-sale terminals",
      "Real-time stock tracking",
      "Purchase order management",
      "Supplier directory & ordering",
      "Deni (credit) management",
    ],
  },
];

const Solutions = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      {/* Hero */}
      <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Solutions
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          One Platform, Tailored to Your Industry
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Siohioma adapts to your sector — from beauty parlours to hospitals,
          hotels to hardware stores. Explore what we've built for you.
        </p>
      </section>

      {/* Sector Sections */}
      {sectors.map((sector, i) => {
        const Icon = sector.icon;
        const isEven = i % 2 === 0;
        return (
          <section
            key={sector.id}
            id={sector.id}
            className="scroll-mt-28"
          >
            <div
              className={`neo-extruded p-6 sm:p-10 lg:p-14 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-14 items-start`}
            >
              {/* Info */}
              <div className="flex-1 space-y-6">
                <div className="squircle-icon w-14 h-14">
                  <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {sector.title}
                </h2>
                <p className="text-xl text-muted-foreground font-medium">
                  {sector.tagline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sector.description}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link to={`/solutions/${sector.id}`} className="neo-pill inline-block text-sm">
                    Learn More
                  </Link>
                  <Link
                    to="/contact"
                    className="neo-extruded-sm inline-block px-6 py-3 font-semibold text-sm text-foreground hover:text-foreground/80 transition-colors"
                    style={{ borderRadius: "9999px" }}
                  >
                    Book a Demo
                  </Link>
                </div>
              </div>

              {/* Features */}
              <div className="flex-1 w-full space-y-3">
                {sector.highlights.map((h) => (
                  <div key={h} className="neo-extruded-sm p-4 flex items-start gap-3">
                    <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-sm text-muted-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Don't see your industry?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Siohioma is flexible enough for any business. Talk to us and we'll
          build a solution that fits.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Book a Demo
        </Link>
      </section>
    </div>
  );
};

export default Solutions;
