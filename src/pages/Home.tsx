import { Link } from "react-router-dom";
import {
  Scissors, Stethoscope, Hotel, ShoppingCart, BarChart3, Package, Users,
} from "lucide-react";

const sectors = [
  {
    icon: Scissors,
    title: "Siohioma for Salons",
    description: "Appointment scheduling, service menus, client management, and commission tracking for beauty & wellness brands.",
    badges: ["Real-time inventory", "Client management"],
    link: "/solutions/salons",
  },
  {
    icon: Stethoscope,
    title: "Siohioma for Clinics",
    description: "Patient records, appointment workflows, billing, and pharmacy inventory for healthcare practices.",
    badges: ["Smart analytics", "Patient records"],
    link: "/solutions/clinics",
  },
  {
    icon: Hotel,
    title: "Siohioma for Hotels",
    description: "Room booking, guest management, housekeeping workflows, and revenue dashboards for hospitality businesses.",
    badges: ["Real-time inventory", "Revenue tracking"],
    link: "/solutions/hotels",
  },
  {
    icon: ShoppingCart,
    title: "Siohioma for Retail",
    description: "POS terminals, stock management, supplier ordering, and deni tracking for retail and hardware stores.",
    badges: ["Real-time inventory", "Deni tracking"],
    link: "/solutions/retail",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Beautiful reporting dashboards with revenue insights, trend analysis, and actionable KPIs across all sectors.",
    badges: ["Smart analytics"],
    link: "/pricing",
  },
  {
    icon: Package,
    title: "Supply Chain & Inventory",
    description: "End-to-end supply chain management — purchase orders, supplier directory, stock alerts, and expense tracking.",
    badges: ["Real-time inventory", "Smart analytics"],
    link: "/pricing",
  },
  {
    icon: Users,
    title: "Payroll & HR",
    description: "Staff management, commission calculations, payroll processing, and attendance tracking across all business types.",
    badges: ["Smart analytics"],
    link: "/pricing",
  },
];

const trustedBy = [
  "Kike Glam Loft",
  "Hotel Karanja",
  "CampusLuku",
  "Sebai Suites",
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="neo-extruded p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Business Management Suite
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            One Platform. Every Business.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The ultimate Business Suite for Salons, Clinics, Hotels, and Retail.
            Manage POS, inventory, and payroll with precision.
          </p>

          <Link to="/contact" className="neo-pill inline-block">
            Book a Demo
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="space-y-6">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Trusted By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {trustedBy.map((name) => (
            <div
              key={name}
              className="neo-extruded-sm px-8 py-4 text-sm font-semibold text-muted-foreground tracking-wide"
              style={{ borderRadius: "9999px" }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Sector Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Built for Every Sector
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built modules for the industries that matter most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.title}
                className="neo-extruded p-6 sm:p-8 space-y-5 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="squircle-icon w-14 h-14">
                  <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{sector.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {sector.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sector.badges.map((badge) => (
                    <span
                      key={badge}
                      className="neo-pressed px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <Link
                  to={sector.link}
                  className="text-sm font-semibold text-foreground hover:underline mt-auto"
                >
                  Learn More →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
          Ready to streamline your business?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join hundreds of businesses across East Africa already using Siohioma to manage operations, track inventory, and grow revenue.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Book a Demo
        </Link>
      </section>
    </div>
  );
};

export default Home;
