import { useState, useRef, useEffect } from "react";
import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import siohiomaLogo from "@/assets/siohioma-logo.png";

const mainNav = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

const solutionsDropdown = [
  { label: "Beauty & Wellness", path: "/solutions/salons", description: "Salons, spas & beauty brands", tooltip: "Scheduling, client profiles, commission tracking" },
  { label: "Healthcare", path: "/solutions/clinics", description: "Clinics & medical practices", tooltip: "Patient records, billing, pharmacy inventory" },
  { label: "Hospitality", path: "/solutions/hotels", description: "Hotels & lodges", tooltip: "Room booking, housekeeping, revenue dashboards" },
  { label: "Retail & Hardware", path: "/solutions/retail", description: "Retail stores & hardware suppliers", tooltip: "POS terminals, stock tracking, supplier ordering" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSolutionActive = location.pathname.startsWith("/solutions");

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-4xl">
        <div className="neo-extruded-sm px-3 py-3 flex items-center justify-between sm:justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 px-2 sm:px-4">
            <img src={siohiomaLogo} alt="Siohioma" className="h-8 w-auto" />
            <span className="font-sans font-bold text-foreground text-lg tracking-tight hidden sm:inline">
              Siohioma
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <RouterNavLink
              to="/"
              className={`px-5 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 ${location.pathname === "/" ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Home
            </RouterNavLink>

            {/* Solutions dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`px-5 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 flex items-center gap-1 ${isSolutionActive ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Solutions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>
              {solutionsOpen && (
                <div className="absolute top-full mt-3 left-0 neo-extruded p-3 min-w-[260px] space-y-1 animate-fade-in-up z-50">
                  <RouterNavLink
                    to="/solutions"
                    onClick={() => setSolutionsOpen(false)}
                    className={`block px-4 py-3 rounded-[calc(var(--radius)-0.5rem)] transition-all duration-200 mb-1 ${location.pathname === "/solutions" ? "neo-pressed" : "hover:bg-accent/50"}`}
                  >
                    <span className="text-sm font-semibold text-foreground">All Solutions</span>
                    <span className="block text-xs text-muted-foreground">Overview of every sector</span>
                  </RouterNavLink>
                  <div className="h-px bg-border mx-2 mb-1" />
                  {solutionsDropdown.map((item) => (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <RouterNavLink
                          to={item.path}
                          onClick={() => setSolutionsOpen(false)}
                          className={`block px-4 py-3 rounded-[calc(var(--radius)-0.5rem)] transition-all duration-200 ${location.pathname === item.path ? "neo-pressed" : "hover:bg-accent/50"}`}
                        >
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                          <span className="block text-xs text-muted-foreground">{item.description}</span>
                        </RouterNavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="neo-extruded-sm bg-popover max-w-[200px] text-xs">
                        {item.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>

            {mainNav.slice(1).map((item) => (
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
            <RouterNavLink to="/" onClick={() => setMobileOpen(false)} className={`block px-5 py-4 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium transition-all duration-200 ${location.pathname === "/" ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Home
            </RouterNavLink>

            {/* Mobile Solutions accordion */}
            <button
              onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium transition-all duration-200 ${isSolutionActive ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileSolutionsOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileSolutionsOpen && (
              <div className="pl-4 space-y-1">
                {solutionsDropdown.map((item) => (
                  <RouterNavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-5 py-3 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200 ${location.pathname === item.path ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </RouterNavLink>
                ))}
              </div>
            )}

            {mainNav.slice(1).map((item) => (
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
