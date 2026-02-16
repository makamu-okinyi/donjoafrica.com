import { Link } from "react-router-dom";
import { Users, Zap, GraduationCap, Building2, Rocket, Check } from "lucide-react";

const solutions = [
  {
    slug: "hr-for-startups",
    icon: Users,
    title: "HR for Startups",
    tagline: "Hire your first 10 like you'd hire your hundredth.",
    description: "Replace gut-feeling hires with video proof. Watch candidates demonstrate real skills before committing runway to talent.",
    highlights: [
      "60-second video proof clips",
      "Skill Radar for technical & leadership traits",
      "Dossier generation for co-founder review",
      "Pipeline velocity tracking",
    ],
  },
  {
    slug: "hackathons",
    icon: Zap,
    title: "Hackathons & Competitions",
    tagline: "Judge by proof, not by pitch decks.",
    description: "Enable hackathon organizers to collect video submissions, auto-generate participant dossiers, and rank teams by demonstrated output.",
    highlights: [
      "Video submission collection",
      "Automated participant dossiers",
      "Judging dashboards with Skill Radar",
      "Cohort-wide analytics & ranking",
    ],
  },
  {
    slug: "accelerators",
    icon: Rocket,
    title: "Accelerators & Incubators",
    tagline: "Scale your cohort evaluation.",
    description: "Screen hundreds of applicants with proof-based portfolios. Generate investor-ready dossiers and track cohort velocity from day one.",
    highlights: [
      "Bulk dossier generation (150+)",
      "Venture Velocity metrics per cohort",
      "Geospatial talent mapping",
      "Investor-ready PDF exports",
    ],
  },
  {
    slug: "universities",
    icon: GraduationCap,
    title: "Universities & Training",
    tagline: "Graduate with proof, not just a transcript.",
    description: "Let students build video portfolios of real project work. Universities can track skill development and connect graduates to verified opportunities.",
    highlights: [
      "Student video portfolio builder",
      "Skill progression tracking",
      "Employer-facing proof dashboards",
      "Institutional analytics & reporting",
    ],
  },
  {
    slug: "enterprise",
    icon: Building2,
    title: "Enterprise Talent Ops",
    tagline: "Proof-based hiring at scale.",
    description: "For large organisations running structured recruitment. White-label Donjo, integrate via API, and generate compliance-ready dossiers at volume.",
    highlights: [
      "White-label & custom branding",
      "API access & ATS integrations",
      "SLA & uptime guarantees",
      "Dedicated account management",
    ],
  },
];

const Solutions = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Solutions</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
          Proof-Based Hiring for Every Stage
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          From your first startup hire to enterprise-scale cohort evaluation — Donjo adapts to your context.
        </p>
      </section>

      {solutions.map((s, i) => {
        const Icon = s.icon;
        const isEven = i % 2 === 0;
        return (
          <section key={s.slug} id={s.slug} className="scroll-mt-28">
            <div className={`neo-extruded p-6 sm:p-10 lg:p-14 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-14 items-start`}>
              <div className="flex-1 space-y-6">
                <div className="squircle-icon w-14 h-14">
                  <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{s.title}</h2>
                <p className="text-xl text-muted-foreground font-medium">{s.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                <Link to="/contact" className="neo-pill inline-block text-sm">
                  Book a Demo
                </Link>
              </div>
              <div className="flex-1 w-full space-y-3">
                {s.highlights.map((h) => (
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

      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Don't see your use case?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Donjo is flexible enough for any proof-based workflow. Talk to us and we'll build a solution that fits.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Get in Touch
        </Link>
      </section>
    </div>
  );
};

export default Solutions;
