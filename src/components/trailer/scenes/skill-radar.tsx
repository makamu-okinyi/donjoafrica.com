import { push, title, end, type SceneRender } from "./helpers";
import { CohortRadar, SkillTagging, VideoReview } from "../screens";

const scenes: SceneRender[] = [
    title("Skill Radar", "See the shape of your talent."),
    { render: (t) => <SkillTagging t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 4, x: 480, y: 330, z: 1.25 }, { t: 7.4, x: 480, y: 420, z: 1.2 }] },
    { render: (t) => <VideoReview t={t} />, cam: push(5.6, 480, 280, 1.15) },
    { render: (t) => <CohortRadar t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 420, y: 330, z: 1.3 }, { t: 6.6, x: 900, y: 420, z: 1.2 }] },
    end("Ratings, at a glance.", "Illustrative preview with sample content"),
];

export default scenes;
