import { Link } from "react-router-dom";
import { companyLinks, solutionLinks, platformLinks } from "@/data/nav";

const linkClass =
  "inline-block py-1 text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors";

const columns = [
  { title: "Company", label: "Company navigation", links: companyLinks },
  { title: "Solutions", label: "Solutions navigation", links: solutionLinks },
  { title: "Platform", label: "Platform navigation", links: platformLinks },
];

const Footer = () => {
  return (
    <footer className="relative z-10 mt-24 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="space-y-4 sm:col-span-2 lg:col-span-2 max-w-sm">
            <p className="text-xl font-bold text-foreground tracking-tight">Donjo</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Proof Over Promises. A video-first, proof-of-work hiring platform, starting in Kenya and East Africa.
            </p>
            <Link to="/contact" className="neo-pill inline-block text-sm !px-6 !py-3">
              Request Access
            </Link>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.label}>
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">{col.title}</h2>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Donjo</p>
            <Link to="/privacy" className="py-1 hover:text-foreground hover:underline underline-offset-4">Privacy Policy</Link>
            <Link to="/terms" className="py-1 hover:text-foreground hover:underline underline-offset-4">Terms of Use</Link>
            <Link to="/cookies" className="py-1 hover:text-foreground hover:underline underline-offset-4">Cookies</Link>
            <a href="mailto:makamubetsy@gmail.com" className="py-1 hover:text-foreground hover:underline underline-offset-4">Email us</a>
          </div>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://ianotollo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline-offset-4 hover:underline rounded-sm"
            >
              IanOtollo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
