import { push, title, end, type SceneRender } from "./helpers";
import { Passkey, ReviewQueue, Roles } from "../screens";

const scenes: SceneRender[] = [
    title("Enterprise", "Proof, with controls."),
    { render: (t) => <Roles t={t} />, cam: push(6.4, 560, 320, 1.2) },
    { render: (t) => <Passkey t={t} />, cam: push(6, 640, 360, 1.14) },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 0, "shortlisted"], [3.2, 2, "rejected"]]} />, cam: push(5, 560, 300, 1.12) },
    end("Structured, secure, evidence-led.", "Illustrative preview - passkeys in development"),
];

export default scenes;
