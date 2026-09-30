import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

/**
 * Admin-only authentication. There is NO public sign-up: an account can only be created or signed in
 * when its email is on the `admins` allow-list (see admin:createAdmin). Errors are deliberately generic.
 */
const Passkey = ConvexCredentials({
  id: "passkey",
  authorize: async (credentials, ctx) => {
    const response = credentials.response;
    if (typeof response !== "string" || response.length > 20000) return null;
    const userId: string | null = await ctx.runAction(internal.passkeysNode.verifyAuthentication, { response });
    return userId ? { userId: userId as Id<"users"> } : null;
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return { email: String(params.email ?? "").trim().toLowerCase() };
      },
    }),
    Passkey,
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const email = String(args.profile.email ?? "").trim().toLowerCase();
      // ctx.db is untyped inside auth callbacks, so cast to our schema-aware reader.
      const db = ctx.db as unknown as import("./_generated/server").QueryCtx["db"];
      const admin = email
        ? await db.query("admins").withIndex("by_email", (q) => q.eq("email", email)).first()
        : null;
      if (!admin || !admin.active) throw new Error("Not allowed");
      if (args.existingUserId) return args.existingUserId;
      return await ctx.db.insert("users", { email, name: admin.name });
    },
  },
});
