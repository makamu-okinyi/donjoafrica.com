import { Link } from "react-router-dom";
import {
  Video, BarChart3, FileText, MapPin, Zap, Shield,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Proof",
    description: "Applicants create 60-second proof clips demonstrating real technical skills — code execution, architectural design, or strategic pitching.",
    badges: ["Proof-of-work", "Video-first"],
    link: "/pricing",
  },
  {
    icon: BarChart3,
    title: "Skill Radar",
    description: "Visualize candidate strengths across technical, operational, and leadership domains with data-driven radial charts.",
    badges: ["Smart analytics", "Data-driven"],
    link: "/pricing",
  },
  {
    icon: FileText,
    title: "Dossier Generation",
    description: "Export high-fidelity PDF dossiers for over 150 participants instantly — ready for offline review or investor presentations.",
    badges: ["Enterprise-grade", "PDF export"],
    link: "/pricing",
  },
  {
    icon: Zap,
    title: "Venture Velocity",
    description: "Measure the speed of talent movement through your recruitment pipeline with real-time engagement and response metrics.",
    badges: ["Real-time", "Pipeline tracking"],
    link: "/pricing",
  },
  {
    icon: MapPin,
    title: "Geospatial Intelligence",
    description: "Map talent density across regions with a Kenya-first focus. Identify untapped clusters of verified technical talent.",
    badges: ["Geo-mapping", "Kenya focus"],
    link: "/pricing",
  },
  {
    icon: Shield,
    title: "Biometric-Ready Security",
    description: "Enterprise-grade login flow powered by Clerk/WebAuthn — passkeys, biometrics, and elite access control built in.",
    badges: ["WebAuthn", "Zero-trust"],
    link: "/pricing",
  },
];

const trustedBy = [
  "Hotel Karanja",
  "CampusLuku",
  "Kike Glam Loft",
];

const testimonials = [
  {
    quote: "I stopped reading CVs and started watching 60-second proof clips. My hiring speed increased by 300%.",
    author: "— A Founder",
  },
  {
    quote: "I finally have a place where my skills speak louder than my school name.",
    author: "— An Applicant",
  },
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="neo-extruded p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            The Venture Engine
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            Proof Over Promises.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Donjo is the video-first hiring platform built for HR teams who hire on evidence, not assumption.
          </p>

          <Link to="/contact" className="neo-pill inline-block">
            Request Access
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

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            The Venture Engine Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Operational intelligence for proof-based hiring. Watch real proof, generate dossiers, and track pipeline velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="neo-extruded p-6 sm:p-8 space-y-5 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="squircle-icon w-14 h-14">
                  <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.badges.map((badge) => (
                    <span
                      key={badge}
                      className="neo-pressed px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <Link
                  to={feature.link}
                  className="text-sm font-semibold text-foreground hover:underline mt-auto"
                >
                  Learn More →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground text-center">What People Are Saying</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="neo-extruded p-6 sm:p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
              <p className="text-sm font-semibold text-foreground">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="neo-extruded p-6 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
          Move from CV-centric to proof-centric hiring.
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join HR teams across East Africa already using Donjo to verify talent at scale, generate applicant dossiers, and make data-driven hiring decisions.
        </p>
        <Link to="/contact" className="neo-pill inline-block">
          Request Access
        </Link>
      </section>
    </div>
  );
};

export default Home;
