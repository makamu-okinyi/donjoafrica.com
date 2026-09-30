import { push, title, end, type SceneRender } from "./helpers";
import { EmployerFeed, Portfolio, Recorder } from "../screens";

const scenes: SceneRender[] = [
    title("Universities", "Graduate with proof."),
    { render: (t) => <Recorder t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 2, x: 640, y: 560, z: 1.25 }, { t: 6.6, x: 640, y: 380, z: 1.05 }] },
    { render: (t) => <Portfolio t={t} />, cam: push(5.4, 540, 250, 1.2) },
    { render: (t) => <EmployerFeed t={t} />, cam: push(6.2, 540, 300, 1.15) },
    end("From project to opportunity."),
];

export default scenes;
