import { solutions } from "./solutions";
import { platform } from "./platform";

export { SITE_URL } from "./seo";

export const solutionLinks = solutions.map((s) => ({
  label: s.name,
  to: `/solutions/${s.slug}`,
  summary: s.summary,
}));

export const platformLinks = platform.map((p) => ({
  label: p.name,
  to: `/platform/${p.slug}`,
  summary: p.summary,
}));

export const companyLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Founder", to: "/founder" },
  { label: "Expertise", to: "/expertise" },
  { label: "Pricing", to: "/pricing" },
  { label: "Partners", to: "/partners" },
  { label: "Contact", to: "/contact" },
];

/**
 * Old hash URLs (from when Solutions/Platform were anchors on thin pages)
 * mapped to their dedicated routes. Used to redirect stale bookmarks.
 */
export const legacyHashRedirects: Record<string, string> = {
  "hr-for-startups": "/solutions/hr-for-startups",
  hackathons: "/solutions/hackathons",
  accelerators: "/solutions/accelerators",
  universities: "/solutions/universities",
  enterprise: "/solutions/enterprise",
  "video-proof": "/platform/video-proof",
  "skill-radar": "/platform/skill-radar",
  "dossier-generation": "/platform/dossier-generation",
  "venture-velocity": "/platform/venture-velocity",
  "geospatial-intelligence": "/platform/venture-velocity",
  "biometric-security": "/platform#security",
};
