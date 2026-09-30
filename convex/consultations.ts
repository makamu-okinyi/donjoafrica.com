import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { audit, requireAdmin } from "./lib/adminAuth";
import { enforceRateLimit } from "./lib/rateLimit";

const STATUS = v.union(v.literal("new"), v.literal("contacted"), v.literal("qualified"), v.literal("won"), v.literal("lost"));

/** Called by the /notify-consultation HTTP action. Validated, length-limited and rate limited. */
export const save = internalMutation({
  args: { name: v.string(), email: v.string(), brief: v.string() },
  handler: async (ctx, args) => {
    const name = args.name.trim().slice(0, 100);
    const email = args.email.trim().toLowerCase().slice(0, 254);
    const brief = args.brief.trim().slice(0, 1000);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || brief.length < 3) throw new Error("INVALID");
    await enforceRateLimit(ctx, `consult:email:${email}`, 5);
    await enforceRateLimit(ctx, "consult:global", 100);
    return await ctx.db.insert("consultations", { name, email, brief, status: "new", updatedAt: Date.now() });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("consultations").order("desc").take(1000);
    return rows.map((r) => ({ ...r, status: r.status ?? "new", createdAt: r._creationTime, notes: r.notes ?? [] }));
  },
});

export const setStatus = mutation({
  args: { id: v.id("consultations"), status: STATUS },
  handler: async (ctx, { id, status }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
    await audit(ctx, admin, "lead_status", `${row.email}: ${row.status ?? "new"} -> ${status}`);
  },
});

export const assign = mutation({
  args: { id: v.id("consultations"), assignee: v.string() },
  handler: async (ctx, { id, assignee }) => {
    const admin = await requireAdmin(ctx);
    const value = assignee.trim().slice(0, 80);
    await ctx.db.patch(id, { assignee: value || undefined, updatedAt: Date.now() });
    await audit(ctx, admin, "lead_assign", `${id} -> ${value || "unassigned"}`);
  },
});

export const addNote = mutation({
  args: { id: v.id("consultations"), text: v.string() },
  handler: async (ctx, { id, text }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    const clean = text.trim().slice(0, 1000);
    if (!clean) throw new Error("Empty note");
    await ctx.db.patch(id, { notes: [...(row.notes ?? []), { at: Date.now(), by: admin.email, text: clean }], updatedAt: Date.now() });
    await audit(ctx, admin, "lead_note", row.email);
  },
});
