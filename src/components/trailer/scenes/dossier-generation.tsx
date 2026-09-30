import { push, title, end, type SceneRender } from "./helpers";
import { AdminOverview, DossierExport, ReviewQueue } from "../screens";

const scenes: SceneRender[] = [
    title("Dossier Generation", "Take the review room offline."),
    { render: (t) => <ReviewQueue t={t} actions={[[1.8, 0, "shortlisted"], [2.8, 1, "shortlisted"], [3.7, 3, "shortlisted"]]} />, cam: push(5.2, 560, 300, 1.12) },
    { render: (t) => <AdminOverview t={t} exportAt={3.6} />, cam: [{ t: 0, x: 640, y: 360, z: 1 }, { t: 3.6, x: 1000, y: 150, z: 1.3 }, { t: 4.6, x: 1000, y: 150, z: 1.35 }] },
    { render: (t) => <DossierExport t={t} />, cam: [{ t: 0, x: 640, y: 360, z: 1.05 }, { t: 3, x: 640, y: 360, z: 1.15 }, { t: 7, x: 640, y: 420, z: 1.05 }] },
    end("Ready for the panel."),
];

export default scenes;
