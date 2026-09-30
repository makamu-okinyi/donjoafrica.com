import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { audit, currentAdmin, requireAdmin } from "./lib/adminAuth";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Create (or re-activate) an admin on the allow-list. Run from a terminal:
 *   npx convex run admin:createAdmin '{"email":"you@example.com","name":"Your Name"}'
 * The person then opens /admin/login, chooses "Activate your invited account" and sets a password.
 */
export const createAdmin = internalMutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, { email, name }) => {
    const e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) throw new Error("Invalid email");
    const existing = await ctx.db.query("admins").withIndex("by_email", (q) => q.eq("email", e)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { active: true, name: name ?? existing.name });
      await audit(ctx, null, "admin_reactivated_cli", e);
      return existing._id;
    }
    const id = await ctx.db.insert("admins", { email: e, name, active: true, createdAt: Date.now(), createdBy: "cli" });
    await audit(ctx, null, "admin_created_cli", e);
    return id;
  },
});

/** Who am I? Used by the console to decide between the login screen and the app. Never throws. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const admin = await currentAdmin(ctx);
    if (!admin) return null;
    const row = await ctx.db.query("admins").withIndex("by_email", (q) => q.eq("email", admin.email)).first();
    return { email: admin.email, name: row?.name ?? null };
  },
});

export const recordSignIn = mutation({
  args: { method: v.union(v.literal("password"), v.literal("passkey")), userAgent: v.optional(v.string()) },
  handler: async (ctx, { method, userAgent }) => {
    const admin = await requireAdmin(ctx);
    await audit(ctx, admin, "sign_in", method, userAgent);
  },
});

export const recordIdleSignOut = mutation({
  args: {},
  handler: async (ctx) => {
    const admin = await currentAdmin(ctx);
    if (admin) await audit(ctx, admin, "idle_signout", "30 minutes of inactivity");
  },
});

/* ------------------------------------------------------------------ admin users */

export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("admins").collect();
    const out = [];
    for (const r of rows) {
      const user = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", r.email)).first();
      const passkeys = user ? await ctx.db.query("passkeys").withIndex("by_userId", (q) => q.eq("userId", user._id)).collect() : [];
      out.push({ id: r._id, email: r.email, name: r.name ?? null, active: r.active, createdAt: r.createdAt, createdBy: r.createdBy ?? null, activated: !!user, passkeys: passkeys.length });
    }
    return out.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const inviteAdmin = mutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, { email, name }) => {
    const admin = await requireAdmin(ctx);
    const e = email.trim().toLowerCase();
    if (!EMAIL.test(e)) throw new Error("Enter a valid email");
    const existing = await ctx.db.query("admins").withIndex("by_email", (q) => q.eq("email", e)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { active: true });
    } else {
      await ctx.db.insert("admins", { email: e, name: name?.trim().slice(0, 80) || undefined, active: true, createdAt: Date.now(), createdBy: admin.email });
    }
    await audit(ctx, admin, "admin_invited", e);
  },
});

export const setAdminActive = mutation({
  args: { id: v.id("admins"), active: v.boolean() },
  handler: async (ctx, { id, active }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    if (row.email === admin.email && !active) throw new Error("You cannot deactivate yourself");
    if (!active) {
      const activeCount = (await ctx.db.query("admins").collect()).filter((a) => a.active).length;
      if (activeCount <= 1) throw new Error("At least one active admin is required");
    }
    await ctx.db.patch(id, { active });
    await audit(ctx, admin, active ? "admin_activated" : "admin_deactivated", row.email);
  },
});

/* -------------------------------------------------------------------- audit log */

export const auditLog = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);
    return await ctx.db.query("adminAuditLog").withIndex("by_at").order("desc").take(Math.min(limit ?? 200, 1000));
  },
});

/* ---------------------------------------------------------------------- files */

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Make the allow-list exactly `emails`: any other admin row is deleted. CLI only:
 *   npx convex run --prod admin:restrictAdminsTo '{"emails":["a@x.com","b@y.com"]}'
 */
export const restrictAdminsTo = internalMutation({
  args: { emails: v.array(v.string()) },
  handler: async (ctx, { emails }) => {
    const keep = new Set(emails.map((e) => e.trim().toLowerCase()));
    const removed: string[] = [];
    for (const row of await ctx.db.query("admins").collect()) {
      if (!keep.has(row.email)) {
        await ctx.db.delete(row._id);
        removed.push(row.email);
      }
    }
    if (removed.length) await audit(ctx, null, "admins_removed_cli", removed.join(", "));
    const remaining = (await ctx.db.query("admins").collect()).map((r) => `${r.email}${r.active ? "" : " (inactive)"}`);
    return { removed, remaining };
  },
});
