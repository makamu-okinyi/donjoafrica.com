import { push, title, end, type SceneRender } from "./helpers";
import { Recorder, ReviewQueue, VideoReview } from "../screens";

const scenes: SceneRender[] = [
    title("Video Proof", "Show the work."),
    { render: (t) => <Recorder t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 2, x: 640, y: 560, z: 1.25 }, { t: 5, x: 640, y: 380, z: 1.1 }, { t: 7.4, x: 640, y: 360, z: 1 }] },
    { render: (t) => <ReviewQueue t={t} actions={[[3.4, 0, "shortlisted"]]} />, cam: push(5.4, 560, 250, 1.18) },
    { render: (t) => <VideoReview t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3, x: 480, y: 300, z: 1.2 }, { t: 6, x: 900, y: 320, z: 1.25 }] },
    end("Proof over promises."),
];

export default scenes;
