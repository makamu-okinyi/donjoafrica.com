import { useState } from "react";
import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const mainNav = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Expertise", path: "/expertise" },
  {
    label: "Solutions",
    path: "/solutions",
    children: [
      { label: "HR for Startups", hash: "#hr-for-startups" },
      { label: "Hackathons", hash: "#hackathons" },
      { label: "Accelerators", hash: "#accelerators" },
      { label: "Universities", hash: "#universities" },
      { label: "Enterprise", hash: "#enterprise" },
    ],
  },
  { label: "Partners", path: "/partners" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-5xl">
        <div className="neo-extruded-sm px-3 py-3 flex items-center justify-between sm:justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 px-2 sm:px-4">
            <span className="font-sans font-bold text-foreground text-lg tracking-tight">Donjo</span>
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.path} className="relative group">
                  <RouterNavLink
                    to={item.path}
                    className={`px-4 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </RouterNavLink>
                  <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                    <div className="neo-extruded-sm p-2 min-w-[200px] space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.hash}
                          to={`${item.path}${child.hash}`}
                          className="block px-4 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm text-muted-foreground hover:text-foreground hover:neo-pressed transition-all"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <RouterNavLink
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </RouterNavLink>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden neo-extruded-sm w-10 h-10 flex items-center justify-center rounded-[calc(var(--radius)-0.5rem)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div className="absolute top-20 left-4 right-4 neo-extruded p-4 space-y-1 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.path}>
                  <button
                    onClick={() => setSolOpen(!solOpen)}
                    className="w-full text-left px-5 py-4 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium text-muted-foreground hover:text-foreground flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${solOpen ? "rotate-180" : ""}`} />
                  </button>
                  {solOpen && (
                    <div className="pl-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.hash}
                          to={`${item.path}${child.hash}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-5 py-3 rounded-[calc(var(--radius)-0.5rem)] text-sm text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <RouterNavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-5 py-4 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium transition-all duration-200 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </RouterNavLink>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
