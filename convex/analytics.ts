import { internalMutation, mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { audit, requireAdmin } from "./lib/adminAuth";
import { countryFromTimezone } from "./lib/tz";

const DAY = 24 * 60 * 60 * 1000;
const EAT_OFFSET = 3 * 60 * 60 * 1000;
const QUERY_CAP = 15000;
export const DEFAULT_RETENTION_DAYS = 90;
const RATE_LIMIT_PER_MINUTE = 60;
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const cut = (s: string | undefined, n: number) => (s ? s.slice(0, n) : undefined);

/* ------------------------------------------------------------------------------ ingest */

/** Public, anonymous, batched. No IPs, no PII, no user ids are stored. Bots are filtered client-side and by the id check. */
export const track = mutation({
  args: {
    visitorId: v.string(),
    sessionId: v.string(),
    isNewVisitor: v.boolean(),
    device: v.string(),
    browser: v.string(),
    os: v.string(),
    viewport: v.optional(v.string()),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    referrerHost: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    events: v.array(
      v.object({
        type: v.union(v.literal("pageview"), v.literal("event")),
        name: v.optional(v.string()),
        path: v.string(),
        engagementMs: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, a) => {
    if (!ID_RE.test(a.visitorId) || !ID_RE.test(a.sessionId)) return { accepted: 0 };
    if (a.events.length === 0 || a.events.length > 10) return { accepted: 0 };
    const now = Date.now();
    const recent = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_visitor_at", (q) => q.eq("visitorId", a.visitorId).gte("at", now - 60_000))
      .take(RATE_LIMIT_PER_MINUTE + 1);
    if (recent.length + a.events.length > RATE_LIMIT_PER_MINUTE) return { accepted: 0 };

    let accepted = 0;
    for (const e of a.events) {
      const path = "/" + e.path.replace(/^\/+/, "").split(/[?#]/)[0].slice(0, 200);
      if (path.startsWith("/admin")) continue; // the console is never tracked
      await ctx.db.insert("analyticsEvents", {
        type: e.type,
        name: e.type === "event" ? cut(e.name, 60) : undefined,
        visitorId: a.visitorId,
        sessionId: a.sessionId,
        isNewVisitor: a.isNewVisitor,
        path,
        referrerHost: cut(a.referrerHost, 100),
        utmSource: cut(a.utmSource, 60),
        utmMedium: cut(a.utmMedium, 60),
        utmCampaign: cut(a.utmCampaign, 80),
        device: ["mobile", "tablet", "desktop"].includes(a.device) ? a.device : "desktop",
        browser: cut(a.browser, 30) ?? "Other",
        os: cut(a.os, 30) ?? "Other",
        viewport: cut(a.viewport, 12),
        timezone: cut(a.timezone, 60),
        language: cut(a.language, 20),
        engagementMs: e.engagementMs !== undefined ? Math.min(Math.max(Math.floor(e.engagementMs), 0), 3_600_000) : undefined,
        at: now,
      });
      accepted++;
    }
    return { accepted };
  },
});

/* --------------------------------------------------------------------------- retention */

async function getRetentionDays(ctx: QueryCtx): Promise<number> {
  const row = await ctx.db.query("appSettings").withIndex("by_key", (q) => q.eq("key", "analyticsRetentionDays")).first();
  return row?.value ?? DEFAULT_RETENTION_DAYS;
}

export const prune = internalMutation({
  args: {},
  handler: async (ctx) => {
    const days = await getRetentionDays(ctx);
    const old = await ctx.db.query("analyticsEvents").withIndex("by_at", (q) => q.lt("at", Date.now() - days * DAY)).take(2000);
    await Promise.all(old.map((r) => ctx.db.delete(r._id)));
    return old.length;
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return { retentionDays: await getRetentionDays(ctx) };
  },
});

export const setRetentionDays = mutation({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const admin = await requireAdmin(ctx);
    if (!Number.isInteger(days) || days < 7 || days > 730) throw new Error("Retention must be 7-730 days");
    const row = await ctx.db.query("appSettings").withIndex("by_key", (q) => q.eq("key", "analyticsRetentionDays")).first();
    if (row) await ctx.db.patch(row._id, { value: days });
    else await ctx.db.insert("appSettings", { key: "analyticsRetentionDays", value: days });
    await audit(ctx, admin, "analytics_retention_changed", `${days} days`);
  },
});

/* ---------------------------------------------------------------------------- dashboards */

const eatDay = (at: number) => new Date(at + EAT_OFFSET).toISOString().slice(0, 10);
function tally<T>(items: T[], key: (t: T) => string | undefined) {
  const m = new Map<string, number>();
  for (const i of items) {
    const k = key(i);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

export const summary = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    await requireAdmin(ctx);
    const range = Math.min(Math.max(Math.floor(days), 1), 90);
    const now = Date.now();
    const rows = await ctx.db.query("analyticsEvents").withIndex("by_at", (q) => q.gte("at", now - range * DAY)).order("desc").take(QUERY_CAP + 1);
    const truncated = rows.length > QUERY_CAP;
    const events = truncated ? rows.slice(0, QUERY_CAP) : rows;
    const views = events.filter((e) => e.type === "pageview");
    const named = events.filter((e) => e.type === "event");

    const perDay = new Map<string, { pageviews: number; visitors: Set<string> }>();
    for (let i = range - 1; i >= 0; i--) perDay.set(eatDay(now - i * DAY), { pageviews: 0, visitors: new Set() });
    for (const e of events) {
      const d = perDay.get(eatDay(e.at));
      if (!d) continue;
      d.visitors.add(e.visitorId);
      if (e.type === "pageview") d.pageviews++;
    }
    const series = [...perDay.entries()].map(([day, d]) => ({ day, pageviews: d.pageviews, visitors: d.visitors.size }));

    const visitors = new Set(events.map((e) => e.visitorId));
    const sessions = new Set(events.map((e) => e.sessionId));
    const newVisitors = new Set(events.filter((e) => e.isNewVisitor).map((e) => e.visitorId)).size;

    // Bounce: sessions with at most one pageview, no named events, and under 10s engaged.
    const bySession = new Map<string, { views: number; events: number; engaged: number }>();
    for (const e of events) {
      const s = bySession.get(e.sessionId) ?? { views: 0, events: 0, engaged: 0 };
      if (e.type === "pageview") s.views++;
      else if (e.name === "engagement") s.engaged += e.engagementMs ?? 0;
      else s.events++;
      bySession.set(e.sessionId, s);
    }
    const sess = [...bySession.values()];
    const bounced = sess.filter((s) => s.views <= 1 && s.events === 0 && s.engaged < 10_000).length;
    const engagedMs = sess.reduce((a, s) => a + s.engaged, 0);

    const firstBy = new Map<string, (typeof events)[number]>();
    for (const e of [...events].reverse()) if (!firstBy.has(e.visitorId)) firstBy.set(e.visitorId, e);
    const perVisitor = [...firstBy.values()];

    const pageVisitors = new Map<string, Set<string>>();
    for (const e of views) {
      if (!pageVisitors.has(e.path)) pageVisitors.set(e.path, new Set());
      pageVisitors.get(e.path)!.add(e.visitorId);
    }

    const count = (name: string) => named.filter((e) => e.name === name).length;
    const uniq = (name: string) => new Set(named.filter((e) => e.name === name).map((e) => e.sessionId)).size;
    const contactViews = new Set(views.filter((e) => e.path === "/contact").map((e) => e.sessionId)).size;

    return {
      rangeDays: range,
      truncated,
      hasData: events.length > 0,
      totals: {
        pageviews: views.length,
        visitors: visitors.size,
        sessions: sessions.size,
        newVisitors,
        pagesPerSession: sessions.size ? Math.round((views.length / sessions.size) * 10) / 10 : 0,
        bounceRate: sess.length ? Math.round((bounced / sess.length) * 100) : 0,
        avgEngagedSeconds: sess.length ? Math.round(engagedMs / sess.length / 1000) : 0,
      },
      series,
      topPages: tally(views, (e) => e.path).slice(0, 15).map((p) => ({ path: p.name, views: p.count, visitors: pageVisitors.get(p.name)?.size ?? 0 })),
      referrers: tally(views, (e) => e.referrerHost || "Direct / none").slice(0, 10),
      campaigns: tally(views.filter((e) => e.utmCampaign || e.utmSource), (e) => `${e.utmSource ?? "-"} / ${e.utmMedium ?? "-"} / ${e.utmCampaign ?? "-"}`).slice(0, 10),
      devices: tally(perVisitor, (e) => e.device),
      browsers: tally(perVisitor, (e) => e.browser).slice(0, 8),
      operatingSystems: tally(perVisitor, (e) => e.os).slice(0, 8),
      viewports: tally(perVisitor, (e) => e.viewport).slice(0, 6),
      languages: tally(perVisitor, (e) => e.language?.split("-")[0]).slice(0, 8),
      countries: tally(perVisitor, (e) => countryFromTimezone(e.timezone)).slice(0, 12),
      ctas: [
        { name: "Start with proof", count: count("cta_signup") },
        { name: "Contact us", count: count("cta_request_access") },
        { name: "Log in", count: count("cta_login") },
        { name: "Partner With Us", count: count("cta_partner") },
      ],
      contactFunnel: [
        { label: "Viewed the contact page", count: contactViews },
        { label: "Started the form", count: uniq("contact_start") },
        { label: "Submitted", count: uniq("contact_submit") },
      ],
      partnerFunnel: [
        { label: "Started the partner form", count: uniq("partner_start") },
        { label: "Submitted", count: uniq("partner_submit") },
      ],
      planInterest: {
        views: tally(named.filter((e) => e.name?.startsWith("plan_view:")), (e) => e.name!.slice(10)),
        clicks: tally(named.filter((e) => e.name?.startsWith("plan_cta:")), (e) => e.name!.slice(9)),
      },
    };
  },
});

/** Overview KPIs. */
export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const week = now - 7 * DAY;
    const events = await ctx.db.query("analyticsEvents").withIndex("by_at", (q) => q.gte("at", now - 30 * DAY)).take(QUERY_CAP);
    const consultations = await ctx.db.query("consultations").collect();
    const partnerReqs = await ctx.db.query("partnerRequests").collect();
    const visitors30 = new Set(events.map((e) => e.visitorId)).size;
    const leads30 = consultations.filter((c) => c._creationTime >= now - 30 * DAY).length + partnerReqs.filter((r) => r.createdAt >= now - 30 * DAY).length;
    return {
      visitors30,
      visitors7: new Set(events.filter((e) => e.at >= week).map((e) => e.visitorId)).size,
      pageviews30: events.filter((e) => e.type === "pageview").length,
      consultations: consultations.length,
      consultationsNew: consultations.filter((c) => (c.status ?? "new") === "new").length,
      consultationsWeek: consultations.filter((c) => c._creationTime >= week).length,
      partnerRequests: partnerReqs.length,
      partnerRequestsNew: partnerReqs.filter((r) => r.status === "new").length,
      partnerRequestsWeek: partnerReqs.filter((r) => r.createdAt >= week).length,
      conversionRate: visitors30 ? Math.round((leads30 / visitors30) * 1000) / 10 : 0,
    };
  },
});
