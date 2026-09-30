import type { CSSProperties, ReactNode } from "react";

/** Time helpers. Every scene is a pure function of its local time `t` (seconds), so it is seek-safe. */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Progress of t through the window [a, b], 0..1. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** Typewriter: the first characters of `s` visible at time t. */
export const typed = (s: string, t: number, start: number, cps = 24) =>
  s.slice(0, Math.floor(clamp((t - start) * cps, 0, s.length)));
/** Pop-in style for an element that appears at `at`. */
export const pop = (t: number, at: number, dur = 0.35): CSSProperties => {
  const p = easeOut(seg(t, at, at + dur));
  return { opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + p * 0.04})` };
};

export type CursorKey = [t: number, x: number, y: number, click?: 1];

/** Animated cursor with click ripples, positioned in the 1280x720 stage space. */
export function Cursor({ t, keys }: { t: number; keys: CursorKey[] }) {
  if (t < keys[0][0]) return null;
  let i = 0;
  while (i < keys.length - 1 && t >= keys[i + 1][0]) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const p = a === b ? 1 : easeInOut(seg(t, a[0], b[0]));
  const x = lerp(a[1], b[1], p);
  const y = lerp(a[2], b[2], p);
  const clicks = keys.filter((k) => k[3] && t >= k[0] && t < k[0] + 0.5);
  const press = keys.some((k) => k[3] && t >= k[0] - 0.05 && t < k[0] + 0.12);
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-40" style={{ transform: `translate(${x}px, ${y}px)` }}>
      {clicks.map((k) => {
        const q = seg(t, k[0], k[0] + 0.5);
        return (
          <span
            key={k[0]}
            className="absolute rounded-full border-2 border-[hsl(var(--brand-strong))]"
            style={{ left: -18, top: -18, width: 36, height: 36, opacity: 1 - q, transform: `scale(${0.4 + q * 1.4})` }}
          />
        );
      })}
      <svg width="26" height="30" viewBox="0 0 26 30" style={{ transform: `scale(${press ? 0.88 : 1})`, filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" }}>
        <path d="M3 2l18 12-8 1.6 4.6 8.4-3.4 1.8L11.6 17 6 22z" fill="#1c1f26" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Toast that slides in at `at` and stays until `until`. */
export function Toast({ t, at, until = 99, children }: { t: number; at: number; until?: number; children: ReactNode }) {
  const p = easeOut(seg(t, at, at + 0.35)) * (1 - easeOut(seg(t, until, until + 0.3)));
  return (
    <div
      className="absolute right-10 top-24 z-30 flex items-center gap-3 rounded-2xl bg-[hsl(var(--foreground))] px-5 py-3.5 text-[15px] font-semibold text-white shadow-2xl"
      style={{ opacity: p, transform: `translateY(${(1 - p) * -16}px)` }}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--brand-strong))] text-xs">✓</span>
      {children}
    </div>
  );
}
