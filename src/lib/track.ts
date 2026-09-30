/**
 * First-party, privacy-friendly analytics. Cookie-less: an anonymous random id lives in localStorage
 * (visitor) and sessionStorage (session). No IP, no personal data. Respects Do Not Track, skips bots
 * and the admin console, batches events, and loads only after the page is idle so it never affects
 * Lighthouse or INP. See the Privacy Policy and Cookie Notice.
 */
import { api, getConvex } from "./convexClient";

interface QueuedEvent { type: "pageview" | "event"; name?: string; path: string; engagementMs?: number }

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|prerender|phantom|puppeteer|playwright|chrome-lighthouse/i;
const queue: QueuedEvent[] = [];
let timer: number | undefined;
let enabled: boolean | undefined;
let visibleSince = 0;
let engaged = 0;
let lastPath = "";

const rid = () => {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
};

function isEnabled() {
  if (enabled !== undefined) return enabled;
  const dnt = navigator.doNotTrack === "1" || (window as unknown as { doNotTrack?: string }).doNotTrack === "1";
  enabled = !dnt && !navigator.webdriver && !BOT.test(navigator.userAgent) && !!import.meta.env.VITE_CONVEX_URL;
  return enabled;
}

function ids() {
  let visitorId = "";
  let isNewVisitor = false;
  let sessionId = "";
  try {
    visitorId = localStorage.getItem("donjo_vid") ?? "";
    if (!visitorId) { visitorId = rid(); localStorage.setItem("donjo_vid", visitorId); isNewVisitor = true; }
    sessionId = sessionStorage.getItem("donjo_sid") ?? "";
    if (!sessionId) { sessionId = rid(); sessionStorage.setItem("donjo_sid", sessionId); }
  } catch {
    visitorId = visitorId || rid();
    sessionId = sessionId || rid();
  }
  return { visitorId, sessionId, isNewVisitor };
}

function env() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Other";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iOS/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const w = window.innerWidth;
  const device = w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  const viewport = w < 640 ? "xs" : w < 768 ? "sm" : w < 1024 ? "md" : w < 1440 ? "lg" : "xl";
  let referrerHost: string | undefined;
  try {
    if (document.referrer) {
      const h = new URL(document.referrer).hostname;
      if (h !== location.hostname) referrerHost = h;
    }
  } catch { /* ignore */ }
  const q = new URLSearchParams(location.search);
  return {
    device, browser, os, viewport, referrerHost,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    utmSource: q.get("utm_source") ?? undefined,
    utmMedium: q.get("utm_medium") ?? undefined,
    utmCampaign: q.get("utm_campaign") ?? undefined,
  };
}

async function flush() {
  timer = undefined;
  if (!queue.length) return;
  const batch = queue.splice(0, 10);
  try {
    const client = await getConvex();
    if (!client) return;
    await client.mutation(api.analytics.track, { ...ids(), ...env(), events: batch });
  } catch { /* analytics must never surface errors */ }
  if (queue.length) schedule();
}

function schedule() {
  if (timer === undefined) timer = window.setTimeout(flush, 2000);
}

function push(e: QueuedEvent) {
  if (!isEnabled() || e.path.startsWith("/admin")) return;
  queue.push(e);
  schedule();
}

export function trackPageview(path: string) {
  flushEngagement();
  lastPath = path;
  push({ type: "pageview", path });
}

export function trackEvent(name: string) {
  push({ type: "event", name, path: lastPath || location.pathname });
}

function flushEngagement() {
  if (visibleSince) { engaged += Date.now() - visibleSince; visibleSince = document.visibilityState === "visible" ? Date.now() : 0; }
  if (engaged > 1000 && lastPath) { push({ type: "event", name: "engagement", path: lastPath, engagementMs: engaged }); engaged = 0; }
}

let started = false;
/** Start listeners once, after the page is idle. */
export function startTracking() {
  if (started || typeof window === "undefined") return;
  started = true;
  visibleSince = document.visibilityState === "visible" ? Date.now() : 0;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") { flushEngagement(); visibleSince = 0; void flush(); }
    else visibleSince = Date.now();
  });
  window.addEventListener("pagehide", () => { flushEngagement(); void flush(); });

  // Delegated click tracking for calls to action (no per-component wiring needed).
  document.addEventListener("click", (ev) => {
    const a = (ev.target as Element | null)?.closest?.("a,button") as HTMLElement | null;
    if (!a) return;
    const explicit = a.closest<HTMLElement>("[data-track]")?.dataset.track;
    if (explicit) return trackEvent(explicit);
    const href = a.getAttribute("href") ?? "";
    const text = (a.textContent ?? "").toLowerCase();
    if (/\/auth\b/.test(href) || text.trim() === "log in") return trackEvent("cta_login");
    if (href.startsWith("/contact") && /request access|talk to|contact/.test(text)) return trackEvent("cta_request_access");
    if (href.includes("partner-form") || /partner with us/.test(text)) return trackEvent("cta_partner");
  }, { capture: true });

  // Plan card impressions: <el data-plan-view="slug">.
  if ("IntersectionObserver" in window) {
    const seen = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const slug = (e.target as HTMLElement).dataset.planView;
        if (e.isIntersecting && slug && !seen.has(slug)) { seen.add(slug); trackEvent(`plan_view:${slug}`); io.unobserve(e.target); }
      }
    }, { threshold: 0.6 });
    const scan = () => document.querySelectorAll("[data-plan-view]").forEach((el) => io.observe(el));
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    scan();
  }
}
