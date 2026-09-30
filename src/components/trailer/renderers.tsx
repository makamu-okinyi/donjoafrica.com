import type { SceneRender } from "./scenes/helpers";

export type { Cam, SceneRender } from "./scenes/helpers";

/** Each trailer's scene code is its own chunk, loaded only when that trailer is about to play. */
export const loaders: Record<string, () => Promise<{ default: SceneRender[] }>> = {
  "video-proof": () => import("./scenes/video-proof"),
  "skill-radar": () => import("./scenes/skill-radar"),
  "dossier-generation": () => import("./scenes/dossier-generation"),
  "venture-velocity": () => import("./scenes/venture-velocity"),
  "hr-for-startups": () => import("./scenes/hr-for-startups"),
  hackathons: () => import("./scenes/hackathons"),
  accelerators: () => import("./scenes/accelerators"),
  universities: () => import("./scenes/universities"),
  enterprise: () => import("./scenes/enterprise"),
  platform: () => import("./scenes/platform"),
  home: () => import("./scenes/home"),
};
