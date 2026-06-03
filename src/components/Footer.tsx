import { Link } from "react-router-dom";

const siteLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Founder", to: "/founder" },
  { label: "Pricing", to: "/pricing" },
  { label: "Partners", to: "/partners" },
  { label: "Contact", to: "/contact" },
];

const solutionLinks = [
  { label: "HR for Startups", to: "/solutions#hr-for-startups" },
  { label: "Hackathons", to: "/solutions#hackathons" },
  { label: "Accelerators", to: "/solutions#accelerators" },
  { label: "Universities", to: "/solutions#universities" },
  { label: "Enterprise", to: "/solutions#enterprise" },
];

const platformLinks = [
  { label: "Video Proof", to: "/#video-proof" },
  { label: "Skill Radar", to: "/#skill-radar" },
  { label: "Dossier Generation", to: "/#dossier-generation" },
  { label: "Venture Velocity", to: "/#venture-velocity" },
];

const Footer = () => {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Donjo</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Venture Engine for proof-based hiring. Video portfolios, skill radars, and applicant dossiers — all in one platform.
            </p>
          </div>

          <nav aria-label="Company navigation">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Solutions navigation">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Solutions</h4>
            <ul className="space-y-2">
              {solutionLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Platform features">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="neo-pill inline-block text-sm !px-6 !py-3 mt-4">
              Request Access
            </Link>
          </nav>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Donjo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
