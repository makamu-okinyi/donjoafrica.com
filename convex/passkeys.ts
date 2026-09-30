import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { currentAdmin, audit } from "./lib/adminAuth";

/** Challenges live for 5 minutes and can be consumed exactly once. */
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;

/* Mirrors video-proof-hire/convex/passkeys.ts, with the admin allow-list in place of app profiles. */

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const admin = await currentAdmin(ctx);
    if (!admin) return [];
    const rows = await ctx.db.query("passkeys").withIndex("by_userId", (q) => q.eq("userId", admin.userId as never)).collect();
    return rows
      .map((p) => ({
        id: p._id, deviceLabel: p.deviceLabel, createdAt: p.createdAt, lastUsedAt: p.lastUsedAt ?? null,
        transports: p.transports ?? [], deviceType: p.deviceType ?? null, backedUp: p.backedUp ?? false,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const rename = mutation({
  args: { passkeyId: v.id("passkeys"), deviceLabel: v.string() },
  handler: async (ctx, { passkeyId, deviceLabel }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const label = deviceLabel.trim().slice(0, 60);
    if (!label) throw new Error("Please enter a name for this passkey");
    const row = await ctx.db.get(passkeyId);
    if (!row || row.userId !== userId) throw new Error("Not authorized");
    await ctx.db.patch(passkeyId, { deviceLabel: label });
  },
});

export const remove = mutation({
  args: { passkeyId: v.id("passkeys") },
  handler: async (ctx, { passkeyId }) => {
    const admin = await currentAdmin(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId || !admin) throw new Error("Not authenticated");
    const row = await ctx.db.get(passkeyId);
    if (!row || row.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(passkeyId);
    await audit(ctx, admin, "passkey_removed", row.deviceLabel);
  },
});

/* ---- internal helpers used by the "use node" WebAuthn actions (passkeysNode.ts) ---- */

export const getUserInfo = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    return user ? { email: user.email ?? null, name: user.name ?? null } : null;
  },
});

export const listForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.query("passkeys").withIndex("by_userId", (q) => q.eq("userId", userId)).collect(),
});

export const listForEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const e = email.trim().toLowerCase();
    const user = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", e)).first();
    if (!user) return [];
    return await ctx.db.query("passkeys").withIndex("by_userId", (q) => q.eq("userId", user._id)).collect();
  },
});

export const getByCredentialId = internalQuery({
  args: { credentialId: v.string() },
  handler: async (ctx, { credentialId }) => ctx.db.query("passkeys").withIndex("by_credentialId", (q) => q.eq("credentialId", credentialId)).first(),
});

export const insertPasskey = internalMutation({
  args: {
    userId: v.id("users"), credentialId: v.string(), publicKey: v.string(), counter: v.number(),
    transports: v.optional(v.array(v.string())), deviceLabel: v.string(), deviceType: v.optional(v.string()), backedUp: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dup = await ctx.db.query("passkeys").withIndex("by_credentialId", (q) => q.eq("credentialId", args.credentialId)).first();
    if (dup) throw new Error("Credential already registered");
    const user = await ctx.db.get(args.userId);
    await audit(ctx, user?.email ? { userId: String(args.userId), email: user.email } : null, "passkey_added", args.deviceLabel);
    return await ctx.db.insert("passkeys", { ...args, createdAt: Date.now() });
  },
});

export const recordUse = internalMutation({
  args: { passkeyId: v.id("passkeys"), newCounter: v.number() },
  handler: async (ctx, { passkeyId, newCounter }) => {
    const row = await ctx.db.get(passkeyId);
    if (!row) return false;
    await ctx.db.patch(passkeyId, { counter: Math.max(row.counter, newCounter), lastUsedAt: Date.now() });
    return true;
  },
});

export const createChallenge = internalMutation({
  args: { challenge: v.string(), type: v.union(v.literal("registration"), v.literal("authentication")), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    await ctx.db.insert("webauthnChallenges", { ...args, expiresAt: Date.now() + CHALLENGE_TTL_MS });
  },
});

/** Look up and DELETE a challenge (single use). True only if it existed, had the right type/user and had not expired. */
export const consumeChallenge = internalMutation({
  args: { challenge: v.string(), type: v.union(v.literal("registration"), v.literal("authentication")), userId: v.optional(v.id("users")) },
  handler: async (ctx, { challenge, type, userId }) => {
    const row = await ctx.db.query("webauthnChallenges").withIndex("by_challenge", (q) => q.eq("challenge", challenge)).first();
    if (!row) return false;
    await ctx.db.delete(row._id);
    if (row.type !== type) return false;
    if (row.expiresAt < Date.now()) return false;
    if (type === "registration" && row.userId !== userId) return false;
    return true;
  },
});

export const purgeExpiredChallenges = internalMutation({
  args: {},
  handler: async (ctx) => {
    const expired = await ctx.db.query("webauthnChallenges").withIndex("by_expiresAt", (q) => q.lt("expiresAt", Date.now())).take(500);
    await Promise.all(expired.map((r) => ctx.db.delete(r._id)));
    return expired.length;
  },
});

/** A deactivated (or removed) admin cannot sign in with a passkey. */
export const isSuspended = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    const email = user?.email?.trim().toLowerCase();
    if (!email) return true;
    const admin = await ctx.db.query("admins").withIndex("by_email", (q) => q.eq("email", email)).first();
    return !admin || !admin.active;
  },
});
