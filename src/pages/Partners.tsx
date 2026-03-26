import { Link } from "react-router-dom";

const partners = [
  { name: "Startups Garage", type: "Accelerator", description: "East Africa's leading startup accelerator — where Donjo was born and battle-tested with 150+ applicants." },
  { name: "Hotel Karanja", type: "Hospitality", description: "Pioneering proof-based hospitality recruitment across Kenya's service industry." },
  { name: "CampusLuku", type: "Education", description: "Connecting university talent to verified opportunities through video portfolios." },
  { name: "Kike Glam Loft", type: "Beauty & Wellness", description: "Using Donjo to verify and showcase creative talent in the beauty industry." },
];

const Partners = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Our Partners</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Built With the Ecosystem
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Donjo is trusted by acceleratorS and enterprises across East Africa to power proof-based hiring.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partners.map((p) => (
          <div key={p.name} className="neo-extruded p-6 sm:p-8 space-y-4">
            <div className="squircle-icon w-14 h-14 text-xl font-bold text-foreground">
              {p.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
            <span className="neo-pressed px-3 py-1.5 text-xs font-medium text-muted-foreground inline-block">
              {p.type}
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
          </div>
        ))}
      </section>

      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Become a Partner
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Join the proof-based hiring movement. Whether you're an accelerator, HR or enterprise — let's build together.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Partner With Us
        </Link>
      </section>
    </div>
  );
};

export default Partners;
