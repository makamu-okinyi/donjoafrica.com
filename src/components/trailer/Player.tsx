import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { trailerDuration, type TrailerMeta } from "./meta";
import { renderers, type Cam } from "./renderers";
import { clamp, easeOut, lerp, seg } from "./fx";

const W = 1280;
const H = 720;

/** Locate the scene for a global time. */
function locate(meta: TrailerMeta, time: number) {
  let acc = 0;
  for (let i = 0; i < meta.scenes.length; i++) {
    const d = meta.scenes[i].duration;
    if (time < acc + d || i === meta.scenes.length - 1) return { i, local: clamp(time - acc, 0, d), start: acc };
    acc += d;
  }
  return { i: 0, local: 0, start: 0 };
}

/** Keeps the camera inside the 1280x720 scene so its edges never show. */
function clampCam(c: Cam): Cam {
  const hx = W / 2 / c.z;
  const hy = H / 2 / c.z;
  return { ...c, x: clamp(c.x, hx, W - hx), y: clamp(c.y, hy, H - hy) };
}

function camAt(cam: Cam[] | undefined, t: number): Cam {
  return clampCam(camRaw(cam, t));
}

function camRaw(cam: Cam[] | undefined, t: number): Cam {
  if (!cam || cam.length === 0) return { t, x: W / 2, y: H / 2, z: 1 };
  if (t <= cam[0].t) return cam[0];
  for (let i = 0; i < cam.length - 1; i++) {
    if (t <= cam[i + 1].t) {
      const p = (t - cam[i].t) / (cam[i + 1].t - cam[i].t);
      const e = p * p * (3 - 2 * p);
      return { t, x: lerp(cam[i].x, cam[i + 1].x, e), y: lerp(cam[i].y, cam[i + 1].y, e), z: lerp(cam[i].z, cam[i + 1].z, e) };
    }
  }
  return cam[cam.length - 1];
}

/** Renders one frame of a trailer: scene at a local time, camera, cut transition, grain, vignette and caption. */
export function Stage({ meta, index, local, className, camera = true }: { meta: TrailerMeta; index: number; local: number; className?: string; camera?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    setScale(el.clientWidth / W);
    return () => ro.disconnect();
  }, []);

  const scene = meta.scenes[index];
  const r = renderers[meta.id]?.[index];
  const cut = easeOut(seg(local, 0, 0.32));
  const cam = camera ? camAt(r?.cam, local) : { x: W / 2, y: H / 2, z: 1, t: 0 };
  const words = scene.caption.split(" ");
  const shown = Math.floor(seg(local, 0.5, 0.5 + words.length * 0.12) * words.length + 0.001);
  const fade = 1 - easeOut(seg(local, scene.duration - 0.35, scene.duration));

  return (
    <div ref={box} className={cn("relative aspect-video w-full overflow-hidden bg-[#12151b]", className)}>
      <div style={{ width: W, height: H, transformOrigin: "0 0", transform: `scale(${scale})`, position: "absolute", left: 0, top: 0 }}>
        <div
          style={{
            width: W, height: H, position: "absolute", transformOrigin: "0 0",
            transform: `translate(${W / 2 - cam.x * cam.z}px, ${H / 2 - cam.y * cam.z}px) scale(${cam.z * (1 + (1 - cut) * 0.05)})`,
            opacity: 0.25 + cut * 0.75,
          }}
        >
          {r?.render(local)}
        </div>
      </div>
      {/* film look: vignette + grain */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,.38) 100%)" }} />
      <div className="trailer-grain pointer-events-none absolute -inset-4 opacity-[.07] mix-blend-overlay" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: (1 - fade) * 0.35 }} />
      {scene.caption && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />}
      {scene.caption && (
        <p
          className="pointer-events-none absolute bottom-[7%] left-[4%] right-[4%] max-w-[80%] font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,.65)]"
          style={{ fontSize: `clamp(12px, ${(scale * 44).toFixed(1)}px, 34px)` }}
        >
          {words.map((w, i) => (
            <span key={i} className="mr-[0.28em] inline-block" style={{ opacity: i < shown ? 1 : 0, transform: `translateY(${i < shown ? 0 : 8}px)`, transition: "opacity .25s, transform .25s" }}>{w}</span>
          ))}
        </p>
      )}
      <span className="pointer-events-none absolute right-[2.5%] top-[3%] rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm sm:text-[11px]">
        Illustrative preview
      </span>
    </div>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function useVisible(ref: React.RefObject<Element>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setV(true); return; }
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return v;
}

function usePlayhead(total: number, active: boolean, start = 0, loopRange?: [number, number]) {
  const [time, setTime] = useState(start);
  const t = useRef(start);
  const range = loopRange ?? [0, total];
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t.current += dt;
      if (t.current >= range[1]) t.current = range[0] + (t.current - range[1]);
      acc += dt;
      if (acc >= 1 / 30) { acc = 0; setTime(t.current); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, range[0], range[1]]);
  const seek = useCallback((x: number) => { t.current = clamp(x, 0, total); setTime(t.current); }, [total]);
  return { time, seek };
}

interface PlayerProps {
  meta: TrailerMeta;
  autoplay?: boolean;
  reducedMotion?: boolean;
  onReady?: () => void;
  onFullscreen?: () => void;
  className?: string;
  /** Skip the chapter row (used by compact teasers). */
  compact?: boolean;
}

/** Full trailer player: stage, play/pause, scrubber, chapters. Pauses off-screen, on hover and on focus. */
export default function Player({ meta, autoplay = true, reducedMotion, onReady, onFullscreen, className, compact }: PlayerProps) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useVisible(root);
  const total = useMemo(() => trailerDuration(meta), [meta]);
  const [userPlay, setUserPlay] = useState(autoplay && !reducedMotion);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const running = userPlay && visible && !hover && !focus;
  const { time, seek } = usePlayhead(total, running);
  const { i, local } = locate(meta, time);

  useEffect(() => { onReady?.(); }, [onReady]);

  const starts = useMemo(() => meta.scenes.reduce<number[]>((a, s, k) => (a.push(k ? a[k - 1] + meta.scenes[k - 1].duration : 0), a), []), [meta]);

  if (reducedMotion && !userPlay) {
    return (
      <div ref={root} className={className}>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {meta.scenes.map((s, k) => (
            <li key={s.id} className="space-y-1.5">
              <Stage meta={meta} index={k} local={s.key} camera={false} className="rounded-xl" />
              <p className="text-xs font-medium text-muted-foreground">{s.chapter}</p>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setUserPlay(true)} className="neo-pill mt-4 !px-6 !py-2.5 text-sm">Play trailer</button>
      </div>
    );
  }

  return (
    <div
      ref={root}
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false); }}
    >
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-[var(--neo-shadow)]" role="img" aria-label={`${meta.title}. ${meta.scenes[i].chapter} scene. A transcript follows.`}>
        <Stage meta={meta} index={i} local={local} />
      </div>
      <div className="mt-3 flex h-11 items-center gap-3">
        <button
          type="button"
          onClick={() => setUserPlay((p) => !p)}
          aria-label={userPlay ? "Pause trailer" : "Play trailer"}
          className="squircle-icon h-11 w-11 shrink-0"
        >
          {userPlay ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />}
        </button>
        <input
          type="range" min={0} max={Math.round(total * 10)} value={Math.round(time * 10)}
          onChange={(e) => seek(Number(e.target.value) / 10)}
          aria-label="Trailer timeline" aria-valuetext={`${meta.scenes[i].chapter}, ${fmt(time)} of ${fmt(total)}`}
          className="trailer-range h-11 min-w-0 flex-1"
        />
        <span className="w-[74px] shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground" aria-hidden="true">{fmt(time)} / {fmt(total)}</span>
        {onFullscreen && (
          <button type="button" onClick={onFullscreen} aria-label="Open trailer full screen" className="squircle-icon h-11 w-11 shrink-0">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {!compact && (
        <ul className="mt-2 flex h-9 items-center gap-2 overflow-x-auto" aria-label="Trailer chapters">
          {meta.scenes.map((s, k) => (
            <li key={s.id} className="shrink-0">
              <button
                type="button"
                onClick={() => { seek(starts[k] + 0.01); setUserPlay(true); }}
                aria-current={k === i ? "true" : undefined}
                className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors", k === i ? "bg-foreground text-background" : "neo-pressed !rounded-full text-muted-foreground hover:text-foreground")}
              >
                {s.chapter}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A single scene on loop (used by steppers, role switchers and scrollytelling). */
export function SceneLoop({ meta, index, className, restartKey }: { meta: TrailerMeta; index: number; className?: string; restartKey?: unknown }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useVisible(root);
  const [hover, setHover] = useState(false);
  const dur = meta.scenes[index].duration;
  const { time, seek } = usePlayhead(dur, visible && !hover, 0);
  useEffect(() => { seek(0); }, [index, restartKey, seek]);
  return (
    <div ref={root} className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Stage meta={meta} index={index} local={Math.min(time, dur)} className="rounded-2xl sm:rounded-3xl" />
    </div>
  );
}
