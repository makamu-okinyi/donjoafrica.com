import { push, title, end, type SceneRender } from "./helpers";
import { Challenge, ReviewQueue } from "../screens";

const scenes: SceneRender[] = [
    title("Hackathons", "Judge the demo. Keep the talent."),
    { render: (t) => <Challenge t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 500, y: 250, z: 1.2 }, { t: 8, x: 640, y: 420, z: 1.1 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 0, "shortlisted"], [3.2, 3, "shortlisted"], [4.2, 1, "rejected"]]} />, cam: push(5.6, 560, 300, 1.15) },
    end("Talent that outlasts the weekend."),
];

export default scenes;
