import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { trailerDuration, type TrailerMeta } from "./meta";
import { loaders, type Cam, type SceneRender } from "./renderers";
import { WorldCtx, clamp, easeOut, lerp, seg } from "./fx";

const W = 1280;
const H = 720;

/**
 * Playback starts after the first interaction (move, scroll, key, touch) or a few seconds after load, so the
 * animation never competes with first paint and Lighthouse-style measurement. Real users trigger it almost at once.
 */
function useArmed(delay = 7000) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (armed) return;
    const go = () => setArmed(true);
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const id = window.setTimeout(go, delay);
    return () => { events.forEach((e) => window.removeEventListener(e, go)); window.clearTimeout(id); };
  }, [armed, delay]);
  return armed;
}

/** True on portrait viewports (same rule the hero CSS uses via the `portrait:` variant). */
export function usePortrait() {
  const [p, setP] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(orientation: portrait)");
    setP(q.matches);
    const on = () => setP(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return p;
}

/** Loads this trailer's scene code (its own chunk) on demand. */
export function useScenes(id: string) {
  const [scenes, setScenes] = useState<SceneRender[] | null>(null);
  useEffect(() => {
    let alive = true;
    loaders[id]?.().then((m) => alive && setScenes(m.default));
    return () => { alive = false; };
  }, [id]);
  return scenes;
}

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

/** Keeps the camera inside the scene world so its edges never show. */
function clampCam(c: Cam, ww: number, wh: number): Cam {
  const hx = ww / 2 / c.z;
  const hy = wh / 2 / c.z;
  return { ...c, x: clamp(c.x, hx, ww - hx), y: clamp(c.y, hy, wh - hy) };
}

function camAt(cam: Cam[] | undefined, t: number, ww: number, wh: number): Cam {
  return clampCam(camRaw(cam, t, ww, wh), ww, wh);
}

function camRaw(cam: Cam[] | undefined, t: number, ww: number, wh: number): Cam {
  if (!cam || cam.length === 0) return { t, x: ww / 2, y: wh / 2, z: 1 };
  const shift = (c: Cam): Cam => ({ ...c, x: c.x + (ww - W) / 2, y: c.y + (wh - H) / 2 });
  if (t <= cam[0].t) return shift(cam[0]);
  for (let i = 0; i < cam.length - 1; i++) {
    if (t <= cam[i + 1].t) {
      const p = (t - cam[i].t) / (cam[i + 1].t - cam[i].t);
      const e = p * p * (3 - 2 * p);
      return shift({ t, x: lerp(cam[i].x, cam[i + 1].x, e), y: lerp(cam[i].y, cam[i + 1].y, e), z: lerp(cam[i].z, cam[i + 1].z, e) });
    }
  }
  return shift(cam[cam.length - 1]);
}

/**
 * Renders one frame of a trailer: scene at a local time, camera, cut transition, grain and vignette.
 * `fluid` fills its parent (the full-bleed hero): the scene world widens to match the stage aspect and the UI
 * panels stretch with it. On portrait screens the headline sits above a contained 16:9 scene instead.
 */
export function Stage({ meta, scenes, index, local, className, camera = true, children, fluid, renderOverlay }: {
  meta: TrailerMeta; scenes: SceneRender[] | null; index: number; local: number; className?: string; camera?: boolean;
  children?: React.ReactNode; fluid?: boolean; renderOverlay?: (portrait: boolean) => React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 640, h: 360 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setDim({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const isPortrait = usePortrait();
  const portrait = !!fluid && isPortrait;
  // Portrait: the scene area is measured on its own and the world is 720 wide and as tall as the space allows,
  // so scenes are composed for a tall screen instead of shrinking a desktop layout.
  const [sEl, setSEl] = useState<HTMLDivElement | null>(null);
  const [sdim, setSdim] = useState({ w: 390, h: 420 });
  useEffect(() => {
    if (!sEl) return;
    const measure = () => setSdim({ w: sEl.clientWidth, h: sEl.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(sEl);
    measure();
    return () => ro.disconnect();
  }, [sEl]);
  // Scenes are always 1280x720. In the hero they play inside a product window on the right, leaving the
  // left ~38% for the headline; on portrait screens the window sits under the headline at full width.
  const ww = portrait ? 720 : W;
  const wh = portrait ? clamp((720 * sdim.h) / Math.max(1, sdim.w), 520, 1100) : H;
  const win = fluid && !portrait
    ? (() => {
        const width = Math.min(dim.w * 0.6, dim.h * 0.92 * (16 / 9));
        return { width, height: (width * 9) / 16, left: dim.w - width - dim.w * 0.03, top: (dim.h - (width * 9) / 16) / 2 };
      })()
    : null;
  const scale = portrait ? sdim.w / ww : win ? win.width / ww : dim.w / ww;

  const scene = meta.scenes[index];
  const r = scenes?.[index];
  const cut = easeOut(seg(local, 0, 0.32));
  const cam = camera ? camAt(r?.cam, local, ww, wh) : { x: ww / 2, y: wh / 2, z: 1, t: 0 };
  const fade = 1 - easeOut(seg(local, scene.duration - 0.35, scene.duration));

  const world = (
    <>
      <div style={{ width: ww, height: wh, transformOrigin: "0 0", transform: `scale(${scale})`, position: "absolute", left: 0, top: 0 }}>
        <div
          style={{
            width: ww, height: wh, position: "absolute", transformOrigin: "0 0",
            transform: `translate(${ww / 2 - cam.x * cam.z}px, ${wh / 2 - cam.y * cam.z}px) scale(${cam.z * (1 + (1 - cut) * 0.05)})`,
            opacity: 0.25 + cut * 0.75,
          }}
        >
          <WorldCtx.Provider value={{ w: ww, h: wh }}>{r?.render(local)}</WorldCtx.Provider>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,.34) 100%)" }} />
      <div className="trailer-grain pointer-events-none absolute -inset-4 opacity-[.07] mix-blend-overlay" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: (1 - fade) * 0.35 }} />
    </>
  );

  if (portrait) {
    return (
      <div ref={box} className={cn("relative flex h-full w-full flex-col overflow-hidden bg-[#12151b]", className)} style={{ contain: "layout paint style", containerType: "inline-size" }}>
        {renderOverlay && <div className="relative flex flex-none flex-col justify-center pb-5 pt-1">{renderOverlay(true)}</div>}
        <div ref={setSEl} className="relative min-h-0 flex-1 overflow-hidden">{world}</div>
      </div>
    );
  }
  if (win) {
    return (
      <div
        ref={box}
        className={cn("relative h-full w-full overflow-hidden bg-[#12151b]", className)}
        style={{ contain: "layout paint style", containerType: "inline-size" }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 75% at 24% 50%, hsl(14 80% 30% / .5), transparent 70%)" }} />
        <div
          className="absolute overflow-hidden rounded-[18px] bg-[#12151b] shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/10"
          style={{ left: win.left, top: win.top, width: win.width, height: win.height }}
        >
          {world}
        </div>
        {children}
        {renderOverlay?.(false)}
      </div>
    );
  }
  return (
    <div
      ref={box}
      className={cn("relative w-full overflow-hidden bg-[#12151b]", fluid ? "h-full" : "aspect-video", className)}
      style={{ contain: "layout paint style", containerType: "inline-size" }}
    >
      {world}
      {children}
      {renderOverlay?.(false)}
    </div>
  );
}

/** Frame for the full-bleed hero: the fluid stage and the caption band (the page supplies the navbar band and headline). */
export function HeroFrame({ stage, strip }: { stage: React.ReactNode; strip: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-[#12151b]">
      <div className="relative min-h-0 flex-1">{stage}</div>
      {strip}
    </div>
  );
}

/**
 * Reserved band under the stage: kinetic caption (left), optional docked call to action (centre),
 * "Illustrative preview" (right). Nothing here ever overlaps the scene.
 */
export function CaptionStrip({ caption, local, dock, aside, dark, className }: { caption: string; local: number; dock?: React.ReactNode; aside?: React.ReactNode; dark?: boolean; className?: string }) {
  const words = caption ? caption.split(" ") : [];
  const shown = Math.floor(seg(local, 0.4, 0.4 + Math.max(1, words.length) * 0.12) * words.length + 0.001);
  return (
    <div className={cn("relative grid h-14 shrink-0 grid-cols-[1fr_auto] items-center gap-3 px-3 sm:h-16 sm:grid-cols-[1fr_auto_1fr] sm:px-6 portrait:h-auto portrait:grid-cols-1 portrait:justify-items-center portrait:gap-2 portrait:px-4 portrait:py-3", dark && "bg-[#0e1116] text-white", className)}>
      <p className={cn("min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight sm:text-base portrait:order-1 portrait:max-w-full portrait:flex-none portrait:text-center", dark ? "text-white" : "text-foreground")} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="mr-[0.28em] inline-block" style={{ opacity: i < shown ? 1 : 0, transform: `translateY(${i < shown ? 0 : 6}px)`, transition: "opacity .25s, transform .25s" }}>{w}</span>
        ))}
      </p>
      {dock ? <div className="flex items-center justify-center portrait:order-2 portrait:w-full">{dock}</div> : <span aria-hidden="true" />}
      <div className="hidden items-center justify-self-end gap-4 sm:flex portrait:order-3 portrait:flex portrait:justify-self-center">
        {aside}
        <span className={cn("hidden whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider lg:inline", dark ? "text-white/60" : "text-muted-foreground")}>Illustrative preview</span>
      </div>
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
      if (acc >= 1 / 24) { acc = 0; setTime(t.current); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, range[0], range[1]]);
  const seek = useCallback((x: number) => { t.current = clamp(x, 0, total); setTime(t.current); }, [total]);
  return { time, seek };
}


const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(pointer: fine)");
    setFine(q.matches);
    const on = () => setFine(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return fine;
};

/**
 * Wraps a stage with the trailer's pointer behaviour. Hovering never pauses. On fine pointers the cursor is
 * replaced by a spring-smoothed round play/pause button; clicking (or tapping) anywhere on the stage toggles playback.
 * A real, focusable button is always present for keyboard and screen-reader users (and is visible on touch devices).
 */
function StageBox({ playing, onToggle, children, className, live = true }: { playing: boolean; onToggle: () => void; children: React.ReactNode; className?: string; live?: boolean }) {
  const fine = useFinePointer();
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (!fine || !inside) return;
    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fine, inside]);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    setInside(!(e.target as Element).closest("a,button"));
  };
  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    target.current = p;
    pos.current = { ...p };
    if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    setInside(!(e.target as Element).closest("a,button"));
  };
  const toggle = () => { onToggle(); setFlash((f) => f + 1); };
  const Icon = playing ? Pause : Play;

  return (
    <div
      ref={box}
      className={cn("trailer-stage relative", fine && "cursor-none", className)}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={() => setInside(false)}
      onClick={(e) => { if (!(e.target as Element).closest("a,button,summary,input")) toggle(); }}
    >
      {children}
      {live && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause trailer" : "Play trailer"}
          className="absolute left-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg sr-only focus-visible:not-sr-only [@media(pointer:coarse)]:not-sr-only"
        >
          <Icon className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        </button>
      )}
      {fine && live && (
        <div ref={dot} className="pointer-events-none absolute left-0 top-0 z-30" aria-hidden="true">
          <div
            className="-ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-xl backdrop-blur-sm transition-[opacity,scale] duration-200 ease-out"
            style={{ opacity: inside ? 1 : 0, scale: inside ? "1" : "0.55" }}
          >
            <Icon key={flash} className="trailer-flash h-6 w-6" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
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
  /** Hero mode: stage only (no scrubber or chapters), with an HTML overlay driven by playback state. */
  hero?: boolean;
  overlay?: (s: HeroState) => React.ReactNode;
  /** Content docked in the caption strip (hero call to action). */
  dock?: (s: HeroState) => React.ReactNode;
  /** Extra content at the right end of the caption strip (hero walkthrough link). */
  aside?: React.ReactNode;
}

export interface HeroState { time: number; total: number; live: boolean; playing: boolean; scene: number; portrait?: boolean }

/** Full trailer player: stage, play/pause, scrubber, chapters. Pauses off-screen, on hover and on focus. */
export default function Player({ meta, autoplay = true, reducedMotion, onReady, onFullscreen, className, compact, hero, overlay, dock, aside }: PlayerProps) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useVisible(root);
  const total = useMemo(() => trailerDuration(meta), [meta]);
  const [userPlay, setUserPlay] = useState(autoplay && !reducedMotion);
  const armed = useArmed();
  const running = userPlay && visible && armed; // hovering or focusing never pauses; only the user, leaving the viewport, or not yet interacting
  const { time, seek } = usePlayhead(total, running);
  const { i, local } = locate(meta, time);
  const scenes = useScenes(meta.id);

  useEffect(() => { onReady?.(); }, [onReady]);

  const starts = useMemo(() => meta.scenes.reduce<number[]>((a, s, k) => (a.push(k ? a[k - 1] + meta.scenes[k - 1].duration : 0), a), []), [meta]);

  if (reducedMotion && !userPlay && hero) {
    const k = Math.min(1, meta.scenes.length - 1);
    const st = { time: 0, total, live: false, playing: false, scene: k };
    return (
      <div ref={root} className={cn("h-full", className)}>
        <StageBox playing={false} onToggle={() => setUserPlay(true)} className="h-full">
          <HeroFrame
            stage={<Stage fluid meta={meta} scenes={scenes} index={k} local={meta.scenes[k].key} camera={false} renderOverlay={(portrait) => overlay?.({ ...st, portrait })} />}
            strip={<CaptionStrip dark caption="" local={0} dock={dock?.(st)} aside={aside} />}
          />
        </StageBox>
      </div>
    );
  }
  if (reducedMotion && !userPlay) {
    return (
      <div ref={root} className={className}>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {meta.scenes.map((s, k) => (
            <li key={s.id} className="space-y-1.5">
              <Stage meta={meta} scenes={scenes} index={k} local={s.key} camera={false} className="rounded-xl" />
              <p className="text-xs font-medium text-muted-foreground">{s.chapter}</p>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => setUserPlay(true)} className="neo-pill mt-4 !px-6 !py-2.5 text-sm">Play trailer</button>
      </div>
    );
  }

  if (hero) {
    const st = { time, total, live: true, playing: userPlay, scene: i };
    return (
      <div ref={root} className={cn("h-full", className)}>
        <StageBox playing={userPlay} onToggle={() => setUserPlay((p) => !p)} className="h-full">
          <HeroFrame
            stage={
              <div role="img" aria-label={`${meta.title}. ${meta.scenes[i].chapter} scene. A transcript follows.`} className="h-full">
                <Stage fluid meta={meta} scenes={scenes} index={i} local={local} renderOverlay={(portrait) => overlay?.({ ...st, portrait })} />
              </div>
            }
            strip={<CaptionStrip dark caption={meta.scenes[i].caption} local={local} dock={dock?.(st)} aside={aside} />}
          />
        </StageBox>
      </div>
    );
  }
  return (
    <div ref={root} className={className}>
      <StageBox playing={userPlay} onToggle={() => setUserPlay((p) => !p)} className={cn("overflow-hidden", hero ? "rounded-[1.4rem] sm:rounded-[2rem]" : "rounded-2xl sm:rounded-3xl shadow-[var(--neo-shadow)]")}>
        <div role="img" aria-label={`${meta.title}. ${meta.scenes[i].chapter} scene. A transcript follows.`}>
          <Stage meta={meta} scenes={scenes} index={i} local={local}>{overlay?.({ time, total, live: true, playing: userPlay, scene: i })}</Stage>
        </div>
      </StageBox>
      <CaptionStrip caption={meta.scenes[i].caption} local={local} dock={dock?.({ time, total, live: true, playing: userPlay, scene: i })} />
      {!hero && (<div className="mt-1 flex h-11 items-center gap-3">
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
      </div>)}
      {!compact && !hero && (
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
  const dur = meta.scenes[index].duration;
  const scenes = useScenes(meta.id);
  const { time, seek } = usePlayhead(dur, visible, 0);
  useEffect(() => { seek(0); }, [index, restartKey, seek]);
  return (
    <div ref={root} className={className}>
      <Stage meta={meta} scenes={scenes} index={index} local={Math.min(time, dur)} className="rounded-2xl sm:rounded-3xl" />
    </div>
  );
}
