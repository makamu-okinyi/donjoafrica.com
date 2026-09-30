import { push, title, end, type SceneRender } from "./helpers";
import { AdminOverview, Pipeline, VelocityMap } from "../screens";

const scenes: SceneRender[] = [
    title("Venture Velocity", "Know how fast your pipeline moves."),
    { render: (t) => <Pipeline t={t} />, cam: push(6.4, 700, 340, 1.14) },
    { render: (t) => <AdminOverview t={t + 0.4} cursor={false} />, cam: push(4.6, 480, 420, 1.15) },
    { render: (t) => <VelocityMap t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3.5, x: 460, y: 360, z: 1.3 }, { t: 7, x: 900, y: 300, z: 1.25 }] },
    end("Know how fast you decide.", "Illustrative preview with sample content"),
];

export default scenes;
