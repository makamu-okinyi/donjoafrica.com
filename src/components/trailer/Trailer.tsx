import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { transcriptFor, trailerDuration, trailers } from "./meta";
import { CaptionStrip, HeroFrame, type HeroState } from "./Player";

// The heavy scene code is a separate chunk, loaded only when a trailer is about to be seen.
const Player = lazy(() => import("./Player"));
const SceneLoopLazy = lazy(() => import("./Player").then((m) => ({ default: m.SceneLoop })));

const usePrefersReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(q.matches);
    const on = () => setR(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return r;
};

/** True once the element is within `margin` of the viewport (then stays true). */
function useNear(ref: React.RefObject<Element>, margin = "300px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

/** Static poster: title, chapters and play glyph. Identical in the prerendered HTML and while the player loads. */
function Poster({ id, className, hero, overlay, dock, aside }: { id: string; className?: string; hero?: boolean; overlay?: (s: HeroState) => React.ReactNode; dock?: (s: HeroState) => React.ReactNode; aside?: React.ReactNode }) {
  const m = trailers[id];
  const st: HeroState = { time: 0, total: trailerDuration(m), live: false, playing: false, scene: 0 };
  if (hero) {
    return (
      <HeroFrame
        stage={
          <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#12151b] landscape:block">
            <div className="absolute inset-0" style={{ background: "radial-gradient(70% 70% at 30% 40%, hsl(14 80% 30% / .55), transparent 70%)" }} />
            <div className="relative flex min-h-0 flex-1 flex-col justify-center landscape:contents">{overlay?.(st)}</div>
            <div className="aspect-video w-full shrink-0 landscape:hidden" aria-hidden="true" />
          </div>
        }
        strip={<CaptionStrip dark caption="" local={0} dock={dock?.(st)} aside={aside} />}
      />
    );
  }
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-[#12151b] sm:rounded-3xl", className)}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 45%, hsl(14 80% 30% / .5), transparent 70%)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 sm:h-16 sm:w-16"><Play className="ml-1 h-6 w-6 text-foreground" fill="currentColor" aria-hidden="true" /></span>
        <p className="px-6 text-base font-bold tracking-tight sm:text-2xl">{m.title}</p>
      </div>
    </div>
  );
}

interface TrailerProps {
  id: string;
  className?: string;
  compact?: boolean;
  /** Hide the transcript (for decorative teasers that sit next to a full one). */
  noTranscript?: boolean;
  /** Mount immediately rather than when scrolled near. */
  eager?: boolean;
  /** Hero mode: framed stage only, HTML overlay (headline, CTA) driven by playback. */
  hero?: boolean;
  overlay?: (s: HeroState) => React.ReactNode;
  dock?: (s: HeroState) => React.ReactNode;
  aside?: React.ReactNode;
}

/**
 * Trailer with poster and transcript in the static HTML, and the auto-playing player lazy-mounted on top.
 * Reserves its full height up front so nothing shifts when the player arrives.
 */
export default function Trailer({ id, className, compact, noTranscript, eager, hero, overlay, dock, aside }: TrailerProps) {
  const m = trailers[id];
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const [idle, setIdle] = useState(false);
  const [modal, setModal] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    const go = () => setIdle(true);
    const h = ric ? ric(go, { timeout: 1800 }) : window.setTimeout(go, 900);
    return () => { if (!ric) window.clearTimeout(h); };
  }, []);

  const mount = (near || eager) && idle;

  return (
    <figure ref={ref} className={cn("w-full min-w-0", hero && "h-full", className)} aria-label={m.title}>
      <div className={cn("relative", hero && "h-full")}>
        {mount ? (
          <Suspense fallback={<><Poster id={id} hero={hero} overlay={overlay} dock={dock} aside={aside} />{!hero && <CaptionStrip caption="" local={0} />}</>}>
            <Player meta={m} reducedMotion={reduced} onFullscreen={() => setModal(true)} compact={compact} hero={hero} overlay={overlay} dock={dock} aside={aside} />
          </Suspense>
        ) : (
          <>
            <Poster id={id} hero={hero} overlay={overlay} dock={dock} aside={aside} />
            {!hero && <CaptionStrip caption="" local={0} />}
            {!hero && <div className="mt-1 h-11" aria-hidden="true" />}
            {!compact && !hero && (
              <ul className="mt-2 flex h-9 items-center gap-2 overflow-hidden" aria-label="Trailer chapters">
                {m.scenes.map((s) => <li key={s.id} className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold neo-pressed !rounded-full text-muted-foreground">{s.chapter}</li>)}
              </ul>
            )}
          </>
        )}
      </div>
      {!noTranscript && hero && (
        <ol className="sr-only">{transcriptFor(m).map((l) => <li key={l}>{l}</li>)}</ol>
      )}
      {!noTranscript && !hero && (
        <details className="mt-3 text-sm text-muted-foreground">
          <summary className="cursor-pointer font-semibold text-foreground">Trailer transcript</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5">{transcriptFor(m).map((l) => <li key={l}>{l}</li>)}</ol>
        </details>
      )}
      {modal && <TrailerModal id={id} onClose={() => setModal(false)} />}
    </figure>
  );
}

/** Accessible full-screen trailer in a native <dialog> (focus trap and Esc come from the platform). */
export function TrailerModal({ id, onClose }: { id: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const m = trailers[id];
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={m.title}
      className="m-auto w-[min(1100px,94vw)] max-w-none rounded-3xl border-0 bg-[hsl(var(--background))] p-3 shadow-2xl backdrop:bg-black/70 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-bold text-foreground sm:text-lg">{m.title}</p>
        <button type="button" onClick={onClose} aria-label="Close trailer" className="squircle-icon h-11 w-11"><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <Suspense fallback={<Poster id={id} />}>
        <Player meta={m} autoplay />
      </Suspense>
      <details className="mt-3 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-foreground">Trailer transcript</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5">{transcriptFor(m).map((l) => <li key={l}>{l}</li>)}</ol>
      </details>
    </dialog>
  );
}

/** Button that opens a trailer in the modal. */
export function WatchTrailerButton({ id, label = "Watch the trailer", className, tone = "dark" }: { id: string; label?: string; className?: string; tone?: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center gap-2 whitespace-nowrap py-3 text-sm font-semibold underline-offset-4 hover:underline", tone === "light" ? "text-white" : "text-foreground", className)}>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", tone === "light" ? "bg-white text-foreground" : "bg-foreground text-background")}><Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden="true" /></span>
        {label}
      </button>
      {open && <TrailerModal id={id} onClose={() => setOpen(false)} />}
    </>
  );
}

/** One scene of a trailer on loop, lazy-loaded. Used by steppers, role switchers and scrollytelling. */
export function SceneView({ id, index, className, restartKey }: { id: string; index: number; className?: string; restartKey?: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);
  const [idle, setIdle] = useState(false);
  useEffect(() => { const h = window.setTimeout(() => setIdle(true), 700); return () => window.clearTimeout(h); }, []);
  const m = trailers[id];
  return (
    <div ref={ref} className={cn("relative aspect-video w-full", className)}>
      {near && idle ? (
        <Suspense fallback={<div className="aspect-video w-full rounded-2xl bg-[#12151b]" />}>
          <SceneLoopLazy meta={m} index={index} restartKey={restartKey} />
        </Suspense>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-[#12151b] text-sm font-semibold text-white/70">{m.scenes[index].chapter}</div>
      )}
    </div>
  );
}
