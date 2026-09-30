import type { MutationCtx } from "../_generated/server";

const WINDOW_MS = 60 * 60 * 1000;

/** Fixed-window rate limit keyed by `key`. Throws RATE_LIMITED when `limit` is exceeded within the window. */
export async function enforceRateLimit(ctx: MutationCtx, key: string, limit: number, windowMs = WINDOW_MS) {
  const now = Date.now();
  const row = await ctx.db.query("rateLimits").withIndex("by_key", (q) => q.eq("key", key)).unique();
  if (!row) {
    await ctx.db.insert("rateLimits", { key, windowStart: now, count: 1 });
    return;
  }
  if (now - row.windowStart > windowMs) {
    await ctx.db.patch(row._id, { windowStart: now, count: 1 });
    return;
  }
  if (row.count >= limit) throw new Error("RATE_LIMITED");
  await ctx.db.patch(row._id, { count: row.count + 1 });
}
