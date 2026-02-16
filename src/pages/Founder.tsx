import profile1 from "@/assets/profile-1.jpeg";
import profile2 from "@/assets/profile-2.jpeg";
import startupsGarage from "@/assets/startups-garage.jpeg";
import { ExternalLink } from "lucide-react";

const techStack = [
  "React", "TypeScript", "Node.js", "Python",
  "AWS", "Supabase", "Figma", "Tableau",
  "Cloudflare WAF", "CSP / HSTS", "Bash Scripting", "Defense-in-Depth",
];

const securityHighlights = [
  { title: "Infrastructure Hardening", description: "Professional-grade _headers configuration for Cloudflare Pages, enforcing strict Content Security Policy (CSP), HSTS, and Permissions-Policy." },
  { title: "Edge-Level Protection", description: "Custom Web Application Firewall (WAF) at the zone level to block reconnaissance attacks and sensitive path scanning (e.g., .env, /admin)." },
  { title: "Automated Security Auditing", description: "Custom Bash-based audit scripts for regression testing on infrastructure security — all sensitive endpoints return 403 Forbidden." },
  { title: "Origin Masking", description: "Orange-Cloud Proxying to hide origin server IPs and enforce traffic inspection at the global edge." },
];

const milestones = [
  { year: "2018", label: "Founded first SaaS startup" },
  { year: "2020", label: "Scaled to $2M ARR" },
  { year: "2022", label: "Launched consultancy practice" },
  { year: "2024", label: "Advised 30+ early-stage startups" },
];

const currentRoles = [
  { title: "CTO", org: "Startups Garage", description: "Leading tech strategy and product development for portfolio startups." },
  { title: "CTO", org: "Hotel Karanja", description: "Building digital infrastructure for hospitality operations.", link: "https://hotelkaranja.pages.dev/" },
];

const Founder = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      {/* Hero */}
      <section className="neo-extruded p-6 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              The Founder
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              Building at the intersection of tech & business.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              A product-minded technologist with deep experience in early-stage ventures, 
              financial modeling, and scaling teams from zero to one.
            </p>
          </div>
          <div className="neo-extruded p-4 overflow-hidden">
            <img
              src={profile1}
              alt="Allan Mbuthia Nganga, CTO and founder"
              loading="lazy"
              className="w-full rounded-[calc(var(--radius)-0.5rem)] object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Current Roles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Current Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentRoles.map((role) => (
            <div key={role.org} className="neo-extruded-sm p-6 space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{role.title}</span>
              <h3 className="text-xl font-bold text-foreground">{role.org}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
              {role.link && (
                <a href={role.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-2">
                  Visit site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Startups Garage — side-by-side */}
      <section className="neo-extruded p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="neo-extruded-sm p-4 overflow-hidden">
            <img
              src={startupsGarage}
              alt="Allan at Startups Garage"
              loading="lazy"
              className="w-full rounded-[calc(var(--radius)-0.5rem)] object-cover aspect-[3/4]"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Startups Garage</h2>
            <p className="text-muted-foreground leading-relaxed">
              Leading tech strategy and product development across a portfolio of early-stage ventures — from ideation through to production-grade infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Defense-in-Depth Security */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Security Engineering
          </p>
          <h2 className="text-3xl font-bold text-foreground">Defense-in-Depth</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Implemented a comprehensive security architecture for high-traffic student portals and HR systems, achieving a verified 125/100 security rating on the Mozilla Observatory. By leveraging Cloudflare's Edge Proxy and a custom Defense-in-Depth strategy, I eliminated common attack vectors such as XSS, Clickjacking, and Data Leakage before they reach the origin server.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityHighlights.map((item) => (
            <div key={item.title} className="neo-extruded-sm p-6 space-y-2">
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="neo-inset p-6 space-y-2">
          <p className="text-sm font-semibold text-foreground">The Consultant Pitch</p>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "Most developers focus only on features. I focus on reliability and risk mitigation. By achieving a 125/100 score, I ensure that the businesses I build for — like Siohioma and Kike Glam Loft — are protected against the automated attacks that take down 90% of small business websites."
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Journey</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div key={m.year} className="neo-extruded-sm p-6 space-y-2">
              <span className="text-2xl font-bold text-foreground">{m.year}</span>
              <p className="text-sm text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {techStack.map((t) => (
            <span
              key={t}
              className="neo-extruded-sm px-6 py-3 text-sm font-semibold text-muted-foreground tracking-wide"
              style={{ borderRadius: "9999px" }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Secondary photo — side-by-side */}
      <section className="neo-extruded p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Focused on building reliable, secure, and scalable systems — from day one through production.
            </p>
          </div>
          <div className="neo-extruded-sm p-4 overflow-hidden">
            <img
              src={profile2}
              alt="Allan Mbuthia working on projects"
              loading="lazy"
              className="w-full rounded-[calc(var(--radius)-0.5rem)] object-cover aspect-[16/9]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founder;
