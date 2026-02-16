import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Kike Glam Loft",
    category: "Beauty / Salon SaaS",
    description:
      "Full-stack salon management platform with online booking, service catalog, and client dashboard for a premium Kiambu-based beauty brand.",
    links: [
      { label: "Public Site", url: "https://kikeglamloft.co.ke" },
      { label: "Internal App", url: "https://app.kikeglamloft.co.ke" },
    ],
  },
  {
    name: "Brian Karanja",
    category: "Real Estate Portfolio",
    description:
      "Personal brand & property showcase for a Kenyan real estate expert — featuring listings, market insights, and consultation booking.",
    links: [
      { label: "Live Site", url: "https://karanjabrian.com" },
      { label: "Preview", url: "https://briankaranja.pages.dev" },
    ],
  },
  {
    name: "Siohioma",
    category: "ERP Ecosystem",
    description:
      "Multi-tenant POS & inventory management system with real-time tracking, deni management, and smart analytics for hardware & building supply stores.",
    links: [
      { label: "Main Website", url: "https://siohioma.com" },
      { label: "Client Instance", url: "https://siohioma71.pages.dev" },
    ],
  },
  {
    name: "Donjo",
    category: "Venture Engine",
    description:
      "Startup accelerator platform with cohort management, mentor matching, application intake pipelines, and program analytics dashboards.",
    links: [
      { label: "Preview", url: "https://video-proof-hire.pages.dev" },
    ],
  },
  {
    name: "AjiraCV",
    category: "CV Builder Platform",
    description:
      "Professional CV creation tool with expert-designed templates, showcase gallery, and freemium pricing — helping job seekers stand out.",
    links: [
      { label: "Live Site", url: "https://ajiracv.co.ke" },
      { label: "System Status", url: "https://status.ajiracv.co.ke" },
    ],
  },
  {
    name: "Campusluku / ShuleJali",
    category: "Education & Campus Systems",
    description:
      "Campus management system featuring fee arrears tracking, transport modules, and student lifecycle management for Kenyan institutions.",
    links: [
      { label: "Live Site", url: "https://campusluku.co.ke" },
    ],
  },
  {
    name: "Sebai Suites",
    category: "Hospitality",
    description:
      "Luxury boutique hotel website with room booking, experiences showcase, and guest-facing journal — blending contemporary elegance with Kenyan warmth.",
    links: [],
  },
];

const Portfolio = () => {
  return (
    <div className="space-y-16 animate-fade-in-up">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Client Projects
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
          Shipped work that&apos;s live in production.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A selection of full-stack products built for real businesses — from
          SaaS platforms and ERPs to personal brands and campus systems.
        </p>
      </section>

      {/* Project Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="neo-extruded p-6 sm:p-8 space-y-4 flex flex-col"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {project.category}
              </span>
              <h2 className="text-2xl font-bold text-foreground">
                {project.name}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {project.description}
            </p>
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-extruded-sm px-5 py-2.5 text-xs font-semibold text-muted-foreground tracking-wide inline-flex items-center gap-2 hover:text-foreground transition-colors"
                    style={{ borderRadius: "9999px" }}
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Portfolio;
