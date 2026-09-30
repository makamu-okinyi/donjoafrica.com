import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx } from "../_generated/server";

export interface AdminIdentity {
  userId: string;
  email: string;
}

/** The signed-in admin, or null. The allow-list (`admins` table) is checked on EVERY call, server-side. */
export async function currentAdmin(ctx: QueryCtx | MutationCtx): Promise<AdminIdentity | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
  const email = user?.email?.trim().toLowerCase();
  if (!email) return null;
  const admin = await ctx.db.query("admins").withIndex("by_email", (q) => q.eq("email", email)).first();
  if (!admin || !admin.active) return null;
  return { userId: String(userId), email };
}

/** Gate for every admin query/mutation. Throws a generic error for anyone who is not an active admin. */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<AdminIdentity> {
  const admin = await currentAdmin(ctx);
  if (!admin) throw new Error("Not authorized");
  return admin;
}

/** Append to the admin audit log. Call from every mutation that changes data. */
export async function audit(ctx: MutationCtx, admin: AdminIdentity | null, action: string, detail?: string, userAgent?: string) {
  await ctx.db.insert("adminAuditLog", {
    userId: admin?.userId,
    email: admin?.email,
    action,
    detail: detail?.slice(0, 500),
    at: Date.now(),
    userAgent: userAgent?.slice(0, 300),
  });
}
