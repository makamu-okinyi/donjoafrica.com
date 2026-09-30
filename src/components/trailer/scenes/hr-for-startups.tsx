import { push, title, end, type SceneRender } from "./helpers";
import { EmployerDash, Messaging, PostJob, ReviewQueue } from "../screens";

const scenes: SceneRender[] = [
    title("HR for Startups", "Hire on proof."),
    { render: (t) => <PostJob t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 560, y: 250, z: 1.25 }, { t: 6.6, x: 620, y: 500, z: 1.2 }] },
    { render: (t) => <EmployerDash t={t} />, cam: push(4.4, 520, 300, 1.18) },
    { render: (t) => <ReviewQueue t={t} actions={[[2.0, 1, "shortlisted"], [3.2, 2, "rejected"]]} />, cam: push(4.8, 560, 300, 1.2) },
    { render: (t) => <Messaging t={t} />, cam: push(5, 560, 320, 1.2) },
    end("Your first ten, on evidence."),
];

export default scenes;
