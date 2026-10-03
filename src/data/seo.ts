import { solutions } from "./solutions";
import { platform } from "./platform";

export const SITE_URL = "https://donjoafrica.com";
export const SITE_NAME = "Donjo";
export const LAST_UPDATED = "2026-09-30";
export const LAST_UPDATED_LABEL = "30 September 2026";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface RouteSeo {
  path: string;
  /** Short label for breadcrumbs. */
  label: string;
  /** <title>, keyword first, 60 characters or fewer. */
  title: string;
  /** Meta description, 160 characters or fewer, ends with a call to action. */
  description: string;
  /** One primary keyword followed by 3 to 5 secondary keywords. */
  keywords: string[];
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
}

const core: RouteSeo[] = [
  {
    path: "/",
    label: "Home",
    title: "Donjo Africa | Video-First Hiring Platform for Kenya",
    description:
      "Donjo replaces CVs with short proof-of-work videos. Review real skill, shortlist and export dossiers. Built for Kenya and East Africa. Start free.",
    keywords: ["Donjo", "Donjo Africa", "video hiring platform", "proof-based hiring", "proof of work", "hiring in Kenya", "video portfolio"],
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/about",
    label: "About",
    title: "About Donjo: Proof-Based Hiring for East Africa",
    description:
      "Donjo puts real human signal at the start of hiring, with short proof videos and a single review queue. Read our story and principles, then get in touch.",
    keywords: ["about Donjo", "proof-based hiring", "hiring in East Africa", "fair hiring", "our journey"],
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/founder",
    label: "Founder",
    title: "Makamu Okinyi, Founder of Donjo",
    description:
      "Meet Makamu Okinyi, product-minded technologist and founder of Donjo, building fairer, proof-based hiring for Kenya. Read the story and get in touch.",
    keywords: ["Makamu Okinyi", "Donjo founder", "startup CTO Kenya", "proof-based hiring", "security engineering"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/expertise",
    label: "Expertise",
    title: "Startup Advisory and Tech Consulting | Donjo",
    description:
      "Tech strategy, business model design and startup advisory from Donjo's founder, for pre-seed to Series A teams in Kenya. Start a conversation today.",
    keywords: ["startup advisory Kenya", "tech strategy", "fractional CTO", "business model innovation", "product-market fit"],
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/solutions",
    label: "Solutions",
    title: "Hiring Solutions for Every Team | Donjo",
    description:
      "Proof-based hiring for startups, hackathons, accelerators, universities and enterprise. Find the Donjo setup that fits your team, then start free.",
    keywords: ["hiring solutions", "HR for startups", "hackathon platform", "accelerator software", "enterprise hiring"],
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/platform",
    label: "Platform",
    title: "Proof-Based Hiring Platform Features | Donjo",
    description:
      "Video proof, skill radar, dossier generation and pipeline analytics: the four parts of the Donjo platform. See what's live and start free.",
    keywords: ["hiring platform features", "video proof", "skill radar", "applicant dossier", "pipeline analytics"],
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/pricing",
    label: "Pricing",
    title: "Donjo Pricing: Free, Venture and Enterprise",
    description:
      "Start free, upgrade to Venture at $99 a month, or talk to us about Enterprise. Simple pricing for proof-based hiring. Compare plans and get started.",
    keywords: ["Donjo pricing", "hiring platform pricing", "video hiring cost", "free hiring platform", "enterprise plan"],
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/partners",
    label: "Partners",
    title: "Partner with Donjo | Proof-Based Hiring",
    description:
      "Accelerators, universities and employers: partner with Donjo to make hiring in Kenya and East Africa more evidence-based. Send a partnership request.",
    keywords: ["partner with Donjo", "accelerator partnership", "university partnership", "employer partnership", "East Africa hiring"],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact Donjo: Talk to Our Team",
    description:
      "Talk to the Donjo team about proof-based hiring for your startup, programme or enterprise. Send a message or WhatsApp us today.",
    keywords: ["contact Donjo", "book a demo", "hiring platform Kenya", "WhatsApp"],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    title: "Privacy Policy: How Donjo Handles Your Data",
    description: "How Donjo collects, uses, shares and protects personal data under the Kenya Data Protection Act, and how to exercise your rights. Contact us with questions.",
    keywords: ["Donjo privacy policy", "Kenya Data Protection Act", "data protection", "passkeys privacy", "video data privacy"],
    priority: 0.4,
    changefreq: "yearly",
  },
  {
    path: "/terms",
    label: "Terms of Use",
    title: "Terms of Use: Donjo Website and Platform",
    description: "The terms that apply when you use the Donjo website and platform: accounts, content, employer duties, liability and disputes. Read them before signing up.",
    keywords: ["Donjo terms of use", "platform terms", "acceptable use", "employer obligations"],
    priority: 0.4,
    changefreq: "yearly",
  },
  {
    path: "/cookies",
    label: "Cookie Notice",
    title: "Cookie and Local-Storage Notice | Donjo",
    description: "What cookies and browser storage the Donjo website and app use, why, and how to control them. No advertising or tracking cookies on the public website.",
    keywords: ["Donjo cookies", "local storage notice", "Do Not Track", "cookie policy"],
    priority: 0.3,
    changefreq: "yearly",
  },
];

const detail: RouteSeo[] = [...solutions, ...platform].map((p) => ({
  path: `/${p.family}/${p.slug}`,
  label: p.name,
  title: p.metaTitle,
  description: p.metaDescription,
  keywords: [p.keyword, "Donjo", "proof-based hiring", "video hiring", "Kenya"],
  priority: 0.8,
  changefreq: "monthly" as const,
}));

export const routes: RouteSeo[] = [...core, ...detail];

export const getRouteSeo = (path: string) => routes.find((r) => r.path === path);

/** Breadcrumb trail for a path: Home > [Solutions|Platform] > page. */
export function breadcrumbsFor(path: string): { name: string; path: string }[] {
  if (path === "/") return [];
  const trail = [{ name: "Home", path: "/" }];
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 2) {
    const parent = getRouteSeo(`/${parts[0]}`);
    if (parent) trail.push({ name: parent.label, path: parent.path });
  }
  const self = getRouteSeo(path);
  if (self) trail.push({ name: self.label, path });
  return trail;
}
