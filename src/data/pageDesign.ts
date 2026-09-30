export type BlockId =
  | "beforeAfter" | "day" | "bento" | "stepper" | "roles" | "pinned" | "compare" | "status" | "permissions"
  | "faq" | "related" | "cta";

export type HeroStyle = "split" | "reverse" | "wide" | "cinematic" | "minimal";

export interface Cta {
  label: string;
  /** Internal route. */
  to?: string;
  /** External URL (e.g. the app). */
  href?: string;
}

export interface PageDesign {
  /** Trailer id (see trailer/meta.ts). */
  trailer: string;
  hero: HeroStyle;
  primary: Cta;
  secondary: { label: string; kind: "trailer" } | { label: string; kind: "anchor"; target: BlockId };
  /** Order of blocks below the hero. Every page has its own order. */
  layout: BlockId[];
  /** Maps each workflow step to a trailer scene index (steppers and scrollytelling). */
  stepScenes: number[];
  /** Maps each audience card to a trailer scene index (role switcher). */
  roleScenes?: number[];
  closing: { title: string; body: string };
  compare?: { title: string; left: string; right: string; rows: [string, string, string][] };
}

const APP = (import.meta.env.VITE_APP_URL as string | undefined) || "https://hr.donjoafrica.com";

/** Keyed by `${family}/${slug}`. */
export const designs: Record<string, PageDesign> = {
  "solutions/hr-for-startups": {
    trailer: "hr-for-startups", hero: "split",
    primary: { label: "Post your first role", to: "/contact" },
    secondary: { label: "Watch the trailer", kind: "trailer" },
    layout: ["beforeAfter", "day", "bento", "faq", "related", "cta"],
    stepScenes: [1, 2, 3, 4],
    closing: { title: "Your first ten hires start with a clip.", body: "Tell us the role. We'll help you set the video question." },
  },
  "solutions/hackathons": {
    trailer: "hackathons", hero: "wide",
    primary: { label: "Plan your hackathon", to: "/contact" },
    secondary: { label: "See the four steps", kind: "anchor", target: "stepper" },
    layout: ["stepper", "roles", "bento", "cta", "faq", "related"],
    stepScenes: [1, 1, 2, 2], roleScenes: [1, 2, 2],
    closing: { title: "Make your next event outlast the weekend.", body: "Share your dates and format. We'll shape the challenge with you." },
  },
  "solutions/accelerators": {
    trailer: "accelerators", hero: "minimal",
    primary: { label: "Bring your cohort", to: "/contact" },
    secondary: { label: "Compare with spreadsheets", kind: "anchor", target: "compare" },
    layout: ["pinned", "compare", "bento", "faq", "cta", "related"],
    stepScenes: [1, 1, 2, 3],
    closing: { title: "Run your next intake on evidence.", body: "Tell us about your programme and intake size." },
    compare: {
      title: "Spreadsheets and inboxes, or one queue", left: "Spreadsheets and email", right: "Donjo",
      rows: [
        ["Application format", "Every applicant differs", "One guided wizard"],
        ["Pitch material", "Links and attachments", "Video and deck versions in place"],
        ["Decisions", "Threads and sheets", "Shortlist or reject, recorded"],
        ["Committee pack", "Assembled by hand", "PDF export on demand"],
      ],
    },
  },
  "solutions/universities": {
    trailer: "universities", hero: "reverse",
    primary: { label: "Start a campus pilot", to: "/contact" },
    secondary: { label: "See the student view", kind: "anchor", target: "roles" },
    layout: ["roles", "day", "bento", "faq", "related", "cta"],
    stepScenes: [2, 1, 2, 3], roleScenes: [3, 1, 2],
    closing: { title: "Give your students something to show.", body: "Pick a class, club or bootcamp for a pilot." },
  },
  "solutions/enterprise": {
    trailer: "enterprise", hero: "cinematic",
    primary: { label: "Talk to us about enterprise security", to: "/contact" },
    secondary: { label: "Roles and access", kind: "anchor", target: "permissions" },
    layout: ["permissions", "pinned", "compare", "faq", "cta", "related"],
    stepScenes: [1, 1, 3, 3],
    closing: { title: "Bring evidence-led hiring to your process.", body: "Share your requirements. We'll answer security questions directly." },
    compare: {
      title: "Ad hoc screening or a structured flow", left: "Ad hoc", right: "Donjo",
      rows: [
        ["First look", "Varies by screener", "Same video prompt for all"],
        ["Access", "Shared inboxes", "Role-based accounts"],
        ["Sign-in", "Passwords", "Passkeys or passwords"],
        ["Panel pack", "Manual", "PDF dossier"],
      ],
    },
  },
  "platform/video-proof": {
    trailer: "video-proof", hero: "split",
    primary: { label: "Try the recorder", href: `${APP}/auth` },
    secondary: { label: "Watch the trailer", kind: "trailer" },
    layout: ["beforeAfter", "roles", "stepper", "bento", "faq", "related", "cta"],
    stepScenes: [1, 1, 2, 3], roleScenes: [1, 3, 2],
    closing: { title: "Ask for proof. Get it in a minute.", body: "Set a video prompt on your next role or challenge." },
  },
  "platform/skill-radar": {
    trailer: "skill-radar", hero: "wide",
    primary: { label: "Request access", to: "/contact" },
    secondary: { label: "Watch the trailer", kind: "trailer" },
    layout: ["pinned", "bento", "cta", "faq", "related"],
    stepScenes: [1, 1, 3, 3],
    closing: { title: "See every applicant's strengths.", body: "Tell us what you hire for." },
  },
  "platform/dossier-generation": {
    trailer: "dossier-generation", hero: "cinematic",
    primary: { label: "Export your first dossier", to: "/contact" },
    secondary: { label: "Watch it build", kind: "trailer" },
    layout: ["stepper", "bento", "beforeAfter", "faq", "cta", "related"],
    stepScenes: [1, 2, 3, 3],
    closing: { title: "Walk into the panel prepared.", body: "Tell us your panel format and we'll help you set up." },
  },
  "platform/venture-velocity": {
    trailer: "venture-velocity", hero: "reverse",
    primary: { label: "Track your pipeline", to: "/contact" },
    secondary: { label: "Watch the trailer", kind: "trailer" },
    layout: ["pinned", "day", "bento", "faq", "related", "cta"],
    stepScenes: [1, 1, 3, 2],
    closing: { title: "Know your pace before your applicants do.", body: "Tell us your intake and how you report." },
  },
};

export const designFor = (family: string, slug: string) => designs[`${family}/${slug}`];
