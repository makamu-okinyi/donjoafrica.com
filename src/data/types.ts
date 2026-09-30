import type { LucideIcon } from "lucide-react";

/** live = works in the product today; building = actively being built; roadmap = planned, not started. */
export type FeatureStatus = "live" | "building" | "roadmap";

export interface Capability {
  icon: LucideIcon;
  title: string;
  body: string;
  status?: FeatureStatus;
}

export interface DetailContent {
  slug: string;
  family: "solutions" | "platform";
  icon: LucideIcon;
  /** Short name used in nav, cards and breadcrumbs. */
  name: string;
  /** One-line summary for cards and nav descriptions. */
  summary: string;
  /** Primary keyword for the page, used in the title and first 100 words. */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  /** "At a glance" list shown beside the hero (3 short items). */
  glance: { title: string; items: string[] };
  problem: { title: string; points: string[] };
  help: { title: string; intro: string; pillars: { title: string; body: string }[] };
  capabilitiesTitle: string;
  capabilities: Capability[];
  workflowTitle: string;
  workflow: { title: string; body: string }[];
  audienceTitle: string;
  audience: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  /** Full paths of related pages for cross-links. */
  related: string[];
  /** Optional honest note about what is and is not shipped yet. */
  statusNote?: string;
}
