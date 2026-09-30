import { end, push, type SceneRender } from "./helpers";
import { AdaptiveQueue, DossierExport, Recorder } from "../screens";

const scenes: SceneRender[] = [
  { render: (t) => <Recorder t={t * 1.6 + 0.2} />, cam: push(3.6, 640, 500, 1.14) },
  { render: (t) => <AdaptiveQueue t={t * 1.4} actions={[[2.2, 1, "shortlisted"]]} />, cam: push(3.2, 640, 360, 1.04) },
  { render: (t) => <DossierExport t={t * 1.6 + 0.6} />, cam: push(3.0, 640, 360, 1.06) },
  end("Proof over promises."),
];

export default scenes;
