import { useEffect, useRef, useState } from "react";
import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { solutionLinks, platformLinks } from "@/data/nav";

const APP_URL = import.meta.env.VITE_APP_URL || "https://hr.donjoafrica.com";

interface NavGroup {
  label: string;
  path: string;
  overview: string;
  children: { label: string; to: string; summary: string }[];
}

const plainNav = {
  before: [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ],
  after: [
    { label: "Partners", path: "/partners" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ],
};

const groups: NavGroup[] = [
  { label: "Solutions", path: "/solutions", overview: "All solutions", children: solutionLinks },
  { label: "Platform", path: "/platform", overview: "Platform overview", children: platformLinks },
];

const linkBase =
  "px-3 xl:px-4 py-2 rounded-[calc(var(--radius)-0.5rem)] text-sm font-medium transition-all duration-200";

const isActive = (pathname: string, path: string) =>
  path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

/** Desktop dropdown: opens on hover, focus or click; closes on Escape or outside click. */
const DesktopDropdown = ({ group, pathname }: { group: NavGroup; pathname: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = `menu-${group.label.toLowerCase()}`;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const active = isActive(pathname, group.path);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`${linkBase} inline-flex items-center gap-1 ${active ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        {group.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="neo-extruded-sm p-2 w-72 space-y-1">
            <Link
              to={group.path}
              className="block px-4 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm font-semibold text-foreground hover:neo-pressed"
            >
              {group.overview}
            </Link>
            <div className="h-px bg-foreground/10 mx-3" aria-hidden="true" />
            {group.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className="block px-4 py-2.5 rounded-[calc(var(--radius)-0.5rem)] text-sm text-muted-foreground hover:text-foreground hover:neo-pressed transition-all"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // Compact "Request Access" appears once the visitor has scrolled past the top of the page.
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > (pathname === "/" ? window.innerHeight * 0.75 : 520));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);
  const showCta = stuck && pathname !== "/contact";

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const renderLink = (item: { label: string; path: string }) => (
    <RouterNavLink
      key={item.path}
      to={item.path}
      end={item.path === "/"}
      className={`${linkBase} ${isActive(pathname, item.path) ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {item.label}
    </RouterNavLink>
  );

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[calc(100%-1.5rem)] lg:w-auto lg:max-w-6xl">
        <nav aria-label="Primary" className="neo-extruded-sm px-2 py-1.5 lg:px-3 lg:py-2 flex items-center justify-between lg:justify-start gap-4 lg:gap-2">
          <Link to="/" className="flex items-center gap-2 px-2 sm:px-4 rounded-lg" aria-label="Donjo home">
            <span className="font-sans font-bold text-foreground text-lg tracking-tight">Donjo</span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {plainNav.before.map(renderLink)}
            {groups.map((g) => (
              <DesktopDropdown key={g.label} group={g} pathname={pathname} />
            ))}
            {plainNav.after.map(renderLink)}
            {showCta && (
              <Link to="/contact" className="ml-1 whitespace-nowrap rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90">
                Request Access
              </Link>
            )}
            <a
              href={`${APP_URL}/auth`}
              className="ml-1 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold bg-[hsl(var(--brand-strong))] text-[hsl(var(--brand-foreground))] hover:opacity-90 transition-opacity"
            >
              Log in
            </a>
          </div>

          {showCta && (
            <Link to="/contact" className="ml-auto mr-1 whitespace-nowrap rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background lg:hidden">
              Request Access
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden neo-extruded-sm w-10 h-10 flex items-center justify-center rounded-[calc(var(--radius)-0.5rem)]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div
            id="mobile-menu"
            className="absolute top-20 left-4 right-4 max-h-[calc(100dvh-6rem)] overflow-y-auto neo-extruded p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {plainNav.before.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={`block px-5 py-3.5 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium ${isActive(pathname, item.path) ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </RouterNavLink>
            ))}

            {groups.map((g) => {
              const open = openGroup === g.label;
              return (
                <div key={g.label}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`m-${g.label}`}
                    onClick={() => setOpenGroup(open ? null : g.label)}
                    className={`w-full text-left px-5 py-3.5 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium flex items-center justify-between ${isActive(pathname, g.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {g.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {open && (
                    <div id={`m-${g.label}`} className="pl-4 space-y-1">
                      <Link to={g.path} className="block px-5 py-3 rounded-[calc(var(--radius)-0.5rem)] text-sm font-semibold text-foreground">
                        {g.overview}
                      </Link>
                      {g.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-5 py-3 rounded-[calc(var(--radius)-0.5rem)] text-sm text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {plainNav.after.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                className={`block px-5 py-3.5 rounded-[calc(var(--radius)-0.5rem)] text-base font-medium ${isActive(pathname, item.path) ? "neo-pressed text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </RouterNavLink>
            ))}
            <a
              href={`${APP_URL}/auth`}
              className="block mt-2 px-5 py-4 rounded-full text-base font-semibold text-center bg-[hsl(var(--brand-strong))] text-[hsl(var(--brand-foreground))]"
            >
              Log in
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
