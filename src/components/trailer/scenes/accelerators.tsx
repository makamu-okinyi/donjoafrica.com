import { push, title, end, type SceneRender } from "./helpers";
import { AdminOverview, ReviewQueue, Wizard } from "../screens";

const scenes: SceneRender[] = [
    title("Accelerators", "Select on evidence."),
    { render: (t) => <Wizard t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 4, x: 480, y: 250, z: 1.2 }, { t: 9, x: 700, y: 480, z: 1.15 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[1.8, 0, "shortlisted"], [3.0, 2, "rejected"], [4.2, 1, "shortlisted"]]} />, cam: push(6, 560, 300, 1.15) },
    { render: (t) => <AdminOverview t={t} cursor={false} />, cam: push(4.6, 700, 380, 1.15) },
    end("Choose your cohort with confidence."),
];

export default scenes;
