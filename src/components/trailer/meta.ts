/**
 * Light-weight trailer metadata (chapters, captions, transcript). Lives in the main/page bundle so the
 * static HTML has real text; the heavy scene renderers are code-split (see renderers.tsx).
 */
export interface SceneMeta {
  id: string;
  /** Chapter label shown in the scrubber and used for navigation. */
  chapter: string;
  /** Kinetic caption over the scene (empty for title and end cards). */
  caption: string;
  /** Seconds. */
  duration: number;
  /** Local time (s) that best represents the scene: used for the static filmstrip and poster. */
  key: number;
}

export interface TrailerMeta {
  id: string;
  title: string;
  scenes: SceneMeta[];
}

const s = (id: string, chapter: string, caption: string, duration: number, key: number): SceneMeta => ({ id, chapter, caption, duration, key });

export const trailers: Record<string, TrailerMeta> = {
  "video-proof": {
    id: "video-proof",
    title: "Video Proof trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("record", "Record", "An applicant records a short proof clip.", 7.4, 3.2),
      s("queue", "Queue", "It lands in the reviewer's queue.", 5.4, 3.6),
      s("review", "Review", "Watch it. Tag it. Shortlist.", 6.0, 3.4),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  "skill-radar": {
    id: "skill-radar",
    title: "Skill Radar trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("tag", "Tag", "Skills and industries, tagged at the source.", 7.4, 6.4),
      s("review", "Review", "Reviewers watch the proof.", 5.6, 3.4),
      s("radar", "Cohort radar", "The cohort takes shape.", 6.6, 4.5),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  "dossier-generation": {
    id: "dossier-generation",
    title: "Dossier Generation trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("queue", "Review", "Applicants, reviewed in one queue.", 5.2, 3.4),
      s("overview", "Export", "One click on the dashboard.", 4.6, 3.8),
      s("dossier", "Dossier", "A PDF for the panel. A CSV as backup.", 7.0, 5.4),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  "venture-velocity": {
    id: "venture-velocity",
    title: "Venture Velocity trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("pipeline", "Pipeline", "Applications move through the pipeline.", 6.4, 5.2),
      s("overview", "Activity", "Activity, day by day.", 4.6, 3.8),
      s("map", "County map", "Where applicants come from. In development.", 7.0, 5.2),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  "hr-for-startups": {
    id: "hr-for-startups",
    title: "HR for Startups trailer",
    scenes: [
      s("title", "Title", "", 2.0, 1.5),
      s("post", "Post", "Post a role with a video question.", 6.6, 5.8),
      s("dash", "Applicants", "Video applications arrive.", 4.4, 3.4),
      s("queue", "Shortlist", "Shortlist the strongest.", 4.8, 3.2),
      s("message", "Message", "Then start the conversation.", 5.0, 4.0),
      s("end", "End", "", 2.4, 1.8),
    ],
  },
  hackathons: {
    id: "hackathons",
    title: "Hackathons trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("challenge", "Challenge", "Open a challenge. Entries stream in.", 8.0, 5.8),
      s("judge", "Judge", "Judges shortlist from the queue.", 5.6, 4.6),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  accelerators: {
    id: "accelerators",
    title: "Accelerators trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("wizard", "Apply", "Founders apply in six guided steps.", 9.0, 7.0),
      s("queue", "Review", "Your team works one queue.", 6.0, 4.0),
      s("overview", "Cohort", "See the cohort take shape.", 4.6, 3.6),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  universities: {
    id: "universities",
    title: "Universities trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("record", "Record", "Students record their project work.", 6.6, 4.0),
      s("portfolio", "Portfolio", "A public portfolio, shareable by link.", 5.4, 4.0),
      s("feed", "Discovery", "Employers discover and shortlist.", 6.2, 4.6),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  enterprise: {
    id: "enterprise",
    title: "Enterprise trailer",
    scenes: [
      s("title", "Title", "", 2.2, 1.6),
      s("roles", "Roles", "Six roles. Each sees only what it needs.", 6.4, 4.4),
      s("passkey", "Sign-in", "Passkey sign-in. In development.", 6.0, 3.0),
      s("queue", "Review", "Admins review in one place.", 5.0, 3.4),
      s("end", "End", "", 2.6, 1.8),
    ],
  },
  platform: {
    id: "platform",
    title: "The Donjo platform reel",
    scenes: [
      s("title", "The platform", "", 1.8, 1.4),
      s("video", "Video Proof", "Video Proof: show the work.", 3.4, 2.4),
      s("radar", "Skill Radar", "Skill Radar: see the cohort.", 3.4, 3.0),
      s("dossier", "Dossier Generation", "Dossier Generation: take it offline.", 3.8, 3.4),
      s("map", "Venture Velocity", "Venture Velocity: know the pace. In development.", 3.8, 3.0),
      s("end", "End", "", 2.2, 1.6),
    ],
  },
  home: {
    id: "home",
    title: "Donjo product teaser",
    scenes: [
      s("record", "Record", "Show the work.", 3.6, 2.6),
      s("queue", "Review", "Decide on evidence.", 3.2, 2.6),
      s("dossier", "Dossier", "Take it to the panel.", 3.0, 2.6),
      s("end", "End", "", 1.6, 1.2),
    ],
  },
};

export const trailerDuration = (m: TrailerMeta) => m.scenes.reduce((a, x) => a + x.duration, 0);

/** Plain-text transcript for accessibility and SEO. */
export function transcriptFor(m: TrailerMeta): string[] {
  return [
    ...m.scenes.filter((x) => x.caption).map((x) => `${x.chapter}: ${x.caption}`),
    "Illustrative preview with sample content. It shows how the product works, not real applicants or results.",
  ];
}
