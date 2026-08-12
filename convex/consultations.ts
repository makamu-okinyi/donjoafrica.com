import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const save = internalMutation({
  args: { name: v.string(), email: v.string(), brief: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("consultations", {
      name: args.name,
      email: args.email,
      brief: args.brief,
    });
  },
});
