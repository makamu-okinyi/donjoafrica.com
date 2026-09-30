import type { ReactNode } from "react";
import { EndCard, TitleCard } from "../screens";

export interface Cam { t: number; x: number; y: number; z: number }
export interface SceneRender {
  render: (t: number) => ReactNode;
  /** Camera keyframes in stage coordinates (focus point + zoom), interpolated linearly. */
  cam?: Cam[];
}

export const push = (dur: number, x = 640, y = 360, z = 1.12): Cam[] => [{ t: 0, x: 640, y: 360, z: 1 }, { t: dur, x, y, z }];
export const pull = (dur: number, x = 640, y = 360, z = 1.14): Cam[] => [{ t: 0, x, y, z }, { t: dur, x: 640, y: 360, z: 1 }];

export const title = (kicker: string, text: string, sub?: string): SceneRender => ({ render: (t) => <TitleCard t={t} kicker={kicker} title={text} sub={sub} />, cam: push(2.6, 640, 360, 1.05) });
export const end = (line: string, small?: string): SceneRender => ({ render: (t) => <EndCard t={t} line={line} small={small} />, cam: pull(2.6, 640, 360, 1.05) });
