import { push, title, end, type SceneRender } from "./helpers";
import { CohortRadar, DossierExport, Recorder, VelocityMap } from "../screens";

const scenes: SceneRender[] = [
    title("The platform", "Four parts. One engine."),
    { render: (t) => <Recorder t={t * 2 + 0.2} />, cam: push(3.4, 640, 500, 1.2) },
    { render: (t) => <CohortRadar t={t * 1.3} />, cam: push(3.4, 420, 330, 1.25) },
    { render: (t) => <DossierExport t={t * 1.6 + 0.6} />, cam: push(3.8, 640, 380, 1.1) },
    { render: (t) => <VelocityMap t={t * 1.3 + 0.4} />, cam: push(3.8, 460, 360, 1.25) },
    end("Proof, from record to insight.", "Illustrative preview with sample content"),
];

export default scenes;
