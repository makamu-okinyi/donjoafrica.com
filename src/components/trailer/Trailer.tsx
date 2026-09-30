import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { transcriptFor, trailers } from "./meta";

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
function Poster({ id, className }: { id: string; className?: string }) {
  const m = trailers[id];
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-[#12151b] sm:rounded-3xl", className)}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 45%, hsl(14 80% 30% / .5), transparent 70%)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 sm:h-16 sm:w-16"><Play className="ml-1 h-6 w-6 text-foreground" fill="currentColor" aria-hidden="true" /></span>
        <p className="px-6 text-base font-bold tracking-tight sm:text-2xl">{m.title}</p>
      </div>
      <span className="absolute right-[2.5%] top-[3%] rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85">Illustrative preview</span>
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
}

/**
 * Trailer with poster and transcript in the static HTML, and the auto-playing player lazy-mounted on top.
 * Reserves its full height up front so nothing shifts when the player arrives.
 */
export default function Trailer({ id, className, compact, noTranscript, eager }: TrailerProps) {
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
    <figure ref={ref} className={cn("w-full", className)} aria-label={m.title}>
      <div className="relative">
        {mount ? (
          <Suspense fallback={<Poster id={id} />}>
            <Player meta={m} reducedMotion={reduced} onFullscreen={() => setModal(true)} compact={compact} />
          </Suspense>
        ) : (
          <>
            <Poster id={id} />
            <div className="mt-3 h-11" aria-hidden="true" />
            {!compact && (
              <ul className="mt-2 flex h-9 items-center gap-2 overflow-hidden" aria-label="Trailer chapters">
                {m.scenes.map((s) => <li key={s.id} className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold neo-pressed !rounded-full text-muted-foreground">{s.chapter}</li>)}
              </ul>
            )}
          </>
        )}
      </div>
      {!noTranscript && (
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
export function WatchTrailerButton({ id, label = "Watch the trailer", className }: { id: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center gap-2 py-3 text-sm font-semibold text-foreground underline-offset-4 hover:underline", className)}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"><Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden="true" /></span>
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
