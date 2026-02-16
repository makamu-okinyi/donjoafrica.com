import { Link } from "react-router-dom";

const siteLinks = [
  { label: "Home", to: "/" },
  { label: "About Donjo", to: "/about" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

const platformLinks = [
  { label: "Video Portfolios", to: "/pricing" },
  { label: "Skill Radar", to: "/pricing" },
  { label: "Dossier Generation", to: "/pricing" },
  { label: "Venture Velocity", to: "/pricing" },
];

const resourceLinks = [
  { label: "Request Access", to: "/contact" },
  { label: "For Founders", to: "/about" },
  { label: "Privacy Policy", to: "/privacy" },
];

const Footer = () => {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Donjo</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Venture Engine for proof-based hiring. Video portfolios, skill radars, and applicant dossiers — all in one platform.
            </p>
          </div>

          {/* Site Links */}
          <nav aria-label="Site navigation">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform */}
          <nav aria-label="Platform features">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="neo-pill inline-block text-sm !px-6 !py-3 mt-2">
              Request Access
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Donjo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
