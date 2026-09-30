import type { ReactNode } from "react";
import {
  AdminOverview, Challenge, CohortRadar, DossierExport, EmployerDash, EmployerFeed, EndCard, Messaging,
  Passkey, Pipeline, Portfolio, PostJob, Recorder, ReviewQueue, Roles, SkillTagging, TitleCard, VelocityMap, VideoReview, Wizard,
} from "./screens";

export interface Cam { t: number; x: number; y: number; z: number }
export interface SceneRender {
  render: (t: number) => ReactNode;
  /** Camera keyframes in stage coordinates (focus point + zoom), interpolated linearly. */
  cam?: Cam[];
}

const push = (dur: number, x = 640, y = 360, z = 1.12): Cam[] => [{ t: 0, x: 640, y: 360, z: 1 }, { t: dur, x, y, z }];
const pull = (dur: number, x = 640, y = 360, z = 1.14): Cam[] => [{ t: 0, x, y, z }, { t: dur, x: 640, y: 360, z: 1 }];

const title = (kicker: string, text: string, sub?: string): SceneRender => ({ render: (t) => <TitleCard t={t} kicker={kicker} title={text} sub={sub} />, cam: push(2.6, 640, 360, 1.05) });
const end = (line: string, small?: string): SceneRender => ({ render: (t) => <EndCard t={t} line={line} small={small} />, cam: pull(2.6, 640, 360, 1.05) });

export const renderers: Record<string, SceneRender[]> = {
  "video-proof": [
    title("Video Proof", "Show the work."),
    { render: (t) => <Recorder t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 2, x: 640, y: 560, z: 1.25 }, { t: 5, x: 640, y: 380, z: 1.1 }, { t: 7.4, x: 640, y: 360, z: 1 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[3.4, 0, "shortlisted"]]} />, cam: push(5.4, 560, 250, 1.18) },
    { render: (t) => <VideoReview t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 480, y: 300, z: 1.2 }, { t: 6, x: 900, y: 320, z: 1.25 }] },
    end("Proof over promises."),
  ],
  "skill-radar": [
    title("Skill Radar", "See the shape of your talent."),
    { render: (t) => <SkillTagging t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 4, x: 480, y: 330, z: 1.25 }, { t: 7.4, x: 480, y: 420, z: 1.2 }] },
    { render: (t) => <VideoReview t={t} />, cam: push(5.6, 480, 280, 1.15) },
    { render: (t) => <CohortRadar t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 420, y: 330, z: 1.3 }, { t: 6.6, x: 900, y: 420, z: 1.2 }] },
    end("Tags today. Insight tomorrow.", "Illustrative preview - per-applicant radar is planned"),
  ],
  "dossier-generation": [
    title("Dossier Generation", "Take the review room offline."),
    { render: (t) => <ReviewQueue t={t} actions={[[1.8, 0, "shortlisted"], [2.8, 1, "shortlisted"], [3.7, 3, "shortlisted"]]} />, cam: push(5.2, 560, 300, 1.12) },
    { render: (t) => <AdminOverview t={t} exportAt={3.6} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3.6, x: 1000, y: 150, z: 1.3 }, { t: 4.6, x: 1000, y: 150, z: 1.35 }] },
    { render: (t) => <DossierExport t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1.05 }, { t: 3, x: 640, y: 360, z: 1.15 }, { t: 7, x: 640, y: 420, z: 1.05 }] },
    end("Ready for the panel."),
  ],
  "venture-velocity": [
    title("Venture Velocity", "Know how fast your pipeline moves."),
    { render: (t) => <Pipeline t={t} />, cam: push(6.4, 700, 340, 1.14) },
    { render: (t) => <AdminOverview t={t + 0.4} cursor={false} />, cam: push(4.6, 480, 420, 1.15) },
    { render: (t) => <VelocityMap t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3.5, x: 460, y: 360, z: 1.3 }, { t: 7, x: 900, y: 300, z: 1.25 }] },
    end("In development. Coming soon.", "Illustrative preview - features in development"),
  ],
  "hr-for-startups": [
    title("HR for Startups", "Hire on proof."),
    { render: (t) => <PostJob t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 560, y: 250, z: 1.25 }, { t: 6.6, x: 620, y: 500, z: 1.2 }] },
    { render: (t) => <EmployerDash t={t} />, cam: push(4.4, 520, 300, 1.18) },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 1, "shortlisted"], [3.2, 2, "rejected"]]} />, cam: push(4.8, 560, 300, 1.2) },
    { render: (t) => <Messaging t={t} />, cam: push(5, 560, 320, 1.2) },
    end("Your first ten, on evidence."),
  ],
  hackathons: [
    title("Hackathons", "Judge the demo. Keep the talent."),
    { render: (t) => <Challenge t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 500, y: 250, z: 1.2 }, { t: 8, x: 640, y: 420, z: 1.1 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 0, "shortlisted"], [3.2, 3, "shortlisted"], [4.2, 1, "rejected"]]} />, cam: push(5.6, 560, 300, 1.15) },
    end("Talent that outlasts the weekend."),
  ],
  accelerators: [
    title("Accelerators", "Select on evidence."),
    { render: (t) => <Wizard t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 4, x: 480, y: 250, z: 1.2 }, { t: 9, x: 700, y: 480, z: 1.15 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[1.8, 0, "shortlisted"], [3.0, 2, "rejected"], [4.2, 1, "shortlisted"]]} />, cam: push(6, 560, 300, 1.15) },
    { render: (t) => <AdminOverview t={t} cursor={false} />, cam: push(4.6, 700, 380, 1.15) },
    end("Choose your cohort with confidence."),
  ],
  universities: [
    title("Universities", "Graduate with proof."),
    { render: (t) => <Recorder t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 2, x: 640, y: 560, z: 1.25 }, { t: 6.6, x: 640, y: 380, z: 1.05 }] },
    { render: (t) => <Portfolio t={t} />, cam: push(5.4, 540, 250, 1.2) },
    { render: (t) => <EmployerFeed t={t} />, cam: push(6.2, 540, 300, 1.15) },
    end("From project to opportunity."),
  ],
  enterprise: [
    title("Enterprise", "Proof, with controls."),
    { render: (t) => <Roles t={t} />, cam: push(6.4, 560, 320, 1.2) },
    { render: (t) => <Passkey t={t} />, cam: push(6, 640, 360, 1.14) },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 0, "shortlisted"], [3.2, 2, "rejected"]]} />, cam: push(5, 560, 300, 1.12) },
    end("Structured, secure, evidence-led.", "Illustrative preview - passkeys in development"),
  ],
  platform: [
    title("The platform", "Four parts. One engine."),
    { render: (t) => <Recorder t={t * 2 + 0.2} />, cam: push(3.4, 640, 500, 1.2) },
    { render: (t) => <CohortRadar t={t * 1.3} />, cam: push(3.4, 420, 330, 1.25) },
    { render: (t) => <DossierExport t={t * 1.6 + 0.6} />, cam: push(3.8, 640, 380, 1.1) },
    { render: (t) => <VelocityMap t={t * 1.3 + 0.4} />, cam: push(3.8, 460, 360, 1.25) },
    end("Proof, from record to insight.", "Illustrative preview - some features in development"),
  ],
  home: [
    title("Donjo", "Proof Over Promises."),
    { render: (t) => <Recorder t={t * 1.7 + 0.4} />, cam: push(2.8, 640, 520, 1.2) },
    { render: (t) => <ReviewQueue t={t * 1.5} actions={[[2.2, 1, "shortlisted"]]} />, cam: push(2.8, 560, 300, 1.15) },
    end("Decide on evidence."),
  ],
};
