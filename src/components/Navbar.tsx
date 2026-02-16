import { useState, useRef, useEffect } from "react";
import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const mainNav = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-4xl">
        <div className="neo-extruded-sm px-3 py-3 flex items-center justify-between sm:justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 px-2 sm:px-4">
            <span className="font-sans font-bold text-foreground text-lg tracking-tight">
              Donjo
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {mainNav.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </RouterNavLink>
            ))}
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
          <div
            className="absolute top-20 left-4 right-4 neo-extruded p-4 space-y-1 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {mainNav.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-5 py-4 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium transition-all duration-200 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </RouterNavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
