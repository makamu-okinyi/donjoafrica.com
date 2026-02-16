const techStack = [
  "React", "TypeScript", "Node.js", "Python",
  "AWS", "Supabase", "Figma", "Tableau",
  "Cloudflare WAF", "CSP / HSTS", "Bash Scripting", "Defense-in-Depth",
];

const securityHighlights = [
  { title: "Infrastructure Hardening", description: "Professional-grade _headers configuration enforcing strict CSP, HSTS, and Permissions-Policy." },
  { title: "Edge-Level Protection", description: "Custom WAF at the zone level to block reconnaissance attacks and sensitive path scanning." },
  { title: "Automated Auditing", description: "Custom Bash-based audit scripts for regression testing on infrastructure security." },
  { title: "Origin Masking", description: "Orange-Cloud Proxying to hide origin server IPs and enforce traffic inspection at the global edge." },
];

const milestones = [
  { year: "2018", label: "Founded first SaaS startup" },
  { year: "2020", label: "Scaled to $2M ARR" },
  { year: "2022", label: "Launched consultancy practice" },
  { year: "2024", label: "Built Donjo — the Venture Engine" },
];

const currentRoles = [
  { title: "CTO", org: "Startups Garage", description: "Leading tech strategy and product development for portfolio startups." },
  { title: "Creator", org: "Donjo", description: "Architecting the Venture Engine — a video-first proof-of-work platform for proof-based hiring." },
];

const Founder = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">The Founder</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
          Building at the intersection of tech & business.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          A product-minded technologist with deep experience in early-stage ventures, financial modeling, and scaling teams from zero to one.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Current Roles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentRoles.map((role) => (
            <div key={role.org} className="neo-extruded-sm p-6 space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{role.title}</span>
              <h3 className="text-xl font-bold text-foreground">{role.org}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Security Engineering</p>
          <h2 className="text-3xl font-bold text-foreground">Defense-in-Depth</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Implemented a comprehensive security architecture for high-traffic student portals and HR systems, achieving a verified 125/100 security rating on the Mozilla Observatory.
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
      </section>

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

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {techStack.map((t) => (
            <span key={t} className="neo-extruded-sm px-6 py-3 text-sm font-semibold text-muted-foreground tracking-wide" style={{ borderRadius: "9999px" }}>
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Founder;
