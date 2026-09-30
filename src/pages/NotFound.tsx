import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const suggestions = [
  { label: "Solutions", to: "/solutions", body: "Find the setup that fits your team." },
  { label: "Platform", to: "/platform", body: "Video proof, dossiers and analytics." },
  { label: "Pricing", to: "/pricing", body: "Plans from free to custom." },
  { label: "Contact", to: "/contact", body: "Talk to us about your use case." },
];

const NotFound = () => {
  const { pathname } = useLocation();
  usePageMeta("/404", { noindex: true, override: { title: "Page not found | Donjo", description: "The page you were looking for does not exist or has moved." } });

  return (
    <section className="neo-extruded p-6 sm:p-12 lg:p-16 text-center space-y-8" aria-labelledby="nf-title">
      <div className="squircle-icon w-16 h-16 mx-auto">
        <Compass className="w-7 h-7 text-foreground" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="space-y-4">
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.18em]">Error 404</p>
        <h1 id="nf-title" className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight text-balance">
          We couldn't find that page.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          <span className="break-all font-medium text-foreground">{pathname}</span> doesn't exist or has moved. Try one of these instead.
        </p>
      </div>
      <Link to="/" className="neo-pill inline-block">
        Back to Home
      </Link>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-4">
        {suggestions.map((s) => (
          <li key={s.to}>
            <Link to={s.to} className="neo-extruded-sm h-full p-5 flex flex-col gap-2 group hover:shadow-none transition-shadow">
              <span className="font-bold text-foreground">{s.label}</span>
              <span className="text-sm text-muted-foreground flex-1">{s.body}</span>
              <ArrowRight className="h-4 w-4 text-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotFound;
