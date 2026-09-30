import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { audit, requireAdmin } from "./lib/adminAuth";

/**
 * Default plans. Keep in sync with src/data/pricing.ts (the static fallback baked into the
 * prerendered HTML). Only facts that were already published on the Pricing page.
 */
const DEFAULT_PLANS = [
  {
    slug: "starter", name: "Starter", tagline: "For small teams trying proof-based hiring.",
    priceAmount: undefined, currency: "USD", billingPeriod: "free" as const,
    features: ["Post jobs with a video question", "Watch applicants' video portfolios", "Shortlist or reject, with private notes", "Skill tags and a skill match on every applicant", "Applicant dossier, reviewer ratings and radar", "PDF and CSV export of applicants"],
    limits: undefined, highlighted: false, ctaLabel: "Get Started", ctaHref: "/contact", order: 1,
  },
  {
    slug: "venture", name: "Venture", tagline: "For startups and accelerators with a growing pipeline.",
    priceAmount: 99, currency: "USD", billingPeriod: "monthly" as const,
    features: ["Everything in Starter", "Higher limits on active jobs, challenges and shortlist size", "Plan set up and invoiced directly by our team"],
    limits: undefined, highlighted: true, ctaLabel: "Get Started", ctaHref: "/contact", order: 2,
  },
  {
    slug: "enterprise", name: "Enterprise", tagline: "For large cohorts, universities and venture studios.",
    priceAmount: undefined, currency: "USD", billingPeriod: "custom" as const,
    features: ["Everything in Venture", "Limits and terms agreed with you in writing"],
    limits: undefined, highlighted: false, ctaLabel: "Contact Sales", ctaHref: "/contact", order: 3,
  },
];

/** Public: published plans in display order. */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("pricingPlans").withIndex("by_published_order", (q) => q.eq("isPublished", true)).take(12);
    return rows.map((p) => ({
      slug: p.slug, name: p.name, tagline: p.tagline, priceAmount: p.priceAmount ?? null, currency: p.currency,
      billingPeriod: p.billingPeriod, features: p.features, limits: p.limits ?? {}, highlighted: p.highlighted,
      ctaLabel: p.ctaLabel, ctaHref: p.ctaHref, updatedAt: p.updatedAt,
    }));
  },
});

/** Idempotent seed: inserts any default plan whose slug is missing and never overwrites edited rows. Run: npx convex run pricing:seed */
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    for (const plan of DEFAULT_PLANS) {
      const existing = await ctx.db.query("pricingPlans").withIndex("by_slug", (q) => q.eq("slug", plan.slug)).unique();
      if (existing) continue;
      await ctx.db.insert("pricingPlans", { ...plan, isPublished: true, updatedAt: Date.now() });
      inserted++;
    }
    return { inserted };
  },
});

/** Replace every plan with the current defaults. CLI only: npx convex run pricing:reseed */
export const reseed = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const row of await ctx.db.query("pricingPlans").collect()) await ctx.db.delete(row._id);
    for (const plan of DEFAULT_PLANS) await ctx.db.insert("pricingPlans", { ...plan, isPublished: true, updatedAt: Date.now() });
    return { plans: DEFAULT_PLANS.length };
  },
});

/* ------------------------------------------------------------------------------------ admin */

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return (await ctx.db.query("pricingPlans").collect()).sort((a, b) => a.order - b.order);
  },
});

const planFields = {
  slug: v.string(),
  name: v.string(),
  tagline: v.string(),
  priceAmount: v.optional(v.number()),
  currency: v.string(),
  billingPeriod: v.union(v.literal("monthly"), v.literal("yearly"), v.literal("custom"), v.literal("free")),
  features: v.array(v.string()),
  limits: v.optional(v.record(v.string(), v.number())),
  highlighted: v.boolean(),
  ctaLabel: v.string(),
  ctaHref: v.string(),
  isPublished: v.boolean(),
};

function checkPlan(a: { slug: string; name: string; tagline: string; priceAmount?: number; currency: string; billingPeriod: string; features: string[]; ctaLabel: string; ctaHref: string }) {
  const slug = a.slug.trim().toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(slug)) throw new Error("Slug: 2-40 lowercase letters, numbers or dashes");
  if (a.name.trim().length < 2 || a.name.length > 60) throw new Error("Name: 2-60 characters");
  if (a.tagline.length > 160) throw new Error("Tagline: up to 160 characters");
  if (!/^[A-Z]{3}$/.test(a.currency)) throw new Error("Currency must be a 3-letter code such as USD");
  if ((a.billingPeriod === "monthly" || a.billingPeriod === "yearly") && (a.priceAmount === undefined || a.priceAmount < 0 || a.priceAmount > 1_000_000)) throw new Error("Enter a valid price");
  if (a.features.length > 15 || a.features.some((f) => f.trim().length === 0 || f.length > 120)) throw new Error("Up to 15 features of 1-120 characters");
  if (!/^(\/[A-Za-z0-9\-_/#?=&.]*|https:\/\/[^\s]+)$/.test(a.ctaHref)) throw new Error("Button link must be a site path (/contact) or an https URL");
  if (a.ctaLabel.trim().length < 2 || a.ctaLabel.length > 40) throw new Error("Button label: 2-40 characters");
  return slug;
}

export const adminCreate = mutation({
  args: planFields,
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const slug = checkPlan(args);
    if (await ctx.db.query("pricingPlans").withIndex("by_slug", (q) => q.eq("slug", slug)).first()) throw new Error("A plan with that slug already exists");
    const all = await ctx.db.query("pricingPlans").collect();
    const id = await ctx.db.insert("pricingPlans", { ...args, slug, features: args.features.map((f) => f.trim()), order: all.reduce((m, p) => Math.max(m, p.order), 0) + 1, updatedAt: Date.now() });
    await audit(ctx, admin, "plan_created", slug);
    return id;
  },
});

export const adminUpdate = mutation({
  args: { id: v.id("pricingPlans"), ...planFields },
  handler: async (ctx, { id, ...args }) => {
    const admin = await requireAdmin(ctx);
    const slug = checkPlan(args);
    const clash = await ctx.db.query("pricingPlans").withIndex("by_slug", (q) => q.eq("slug", slug)).first();
    if (clash && clash._id !== id) throw new Error("A plan with that slug already exists");
    await ctx.db.patch(id, { ...args, slug, features: args.features.map((f) => f.trim()), updatedAt: Date.now() });
    await audit(ctx, admin, "plan_updated", `${slug}${args.priceAmount !== undefined ? ` at ${args.priceAmount} ${args.currency}` : ""}`);
  },
});

export const adminSetPublished = mutation({
  args: { id: v.id("pricingPlans"), isPublished: v.boolean() },
  handler: async (ctx, { id, isPublished }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(id, { isPublished, updatedAt: Date.now() });
    await audit(ctx, admin, isPublished ? "plan_published" : "plan_unpublished", row.slug);
  },
});

export const adminMove = mutation({
  args: { id: v.id("pricingPlans"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { id, direction }) => {
    const admin = await requireAdmin(ctx);
    const rows = (await ctx.db.query("pricingPlans").collect()).sort((a, b) => a.order - b.order);
    const i = rows.findIndex((r) => r._id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= rows.length) return;
    const [a, b] = [rows[i], rows[j]];
    await ctx.db.patch(a._id, { order: b.order === a.order ? b.order + (direction === "up" ? -1 : 1) : b.order, updatedAt: Date.now() });
    await ctx.db.patch(b._id, { order: a.order, updatedAt: Date.now() });
    await audit(ctx, admin, "plan_reordered", a.slug);
  },
});

export const adminDelete = mutation({
  args: { id: v.id("pricingPlans") },
  handler: async (ctx, { id }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.delete(id);
    await audit(ctx, admin, "plan_deleted", row.slug);
  },
});
