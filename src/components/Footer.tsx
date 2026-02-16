import { Link } from "react-router-dom";

const siteLinks = [
  { label: "Home", to: "/" },
  { label: "About Siohioma", to: "/about" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

const solutionLinks = [
  { label: "Beauty & Wellness", to: "/solutions/salons" },
  { label: "Healthcare", to: "/solutions/clinics" },
  { label: "Hospitality", to: "/solutions/hotels" },
  { label: "Retail & Hardware", to: "/solutions/retail" },
];

const resourceLinks = [
  { label: "Request Demo", to: "/contact" },
  { label: "Hardware POS", to: "/solutions/retail" },
  { label: "Privacy Policy", to: "/privacy" },
];

const Footer = () => {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Siohioma</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate Business Suite for Salons, Clinics, Hotels, and Retail. One platform, every business.
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

          {/* Solutions */}
          <nav aria-label="Solutions">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Solutions</h4>
            <ul className="space-y-2">
              {solutionLinks.map((link) => (
                <li key={link.to}>
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
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="neo-pill inline-block text-sm !px-6 !py-3 mt-2">
              Book a Demo
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Siohioma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
