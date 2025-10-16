import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create user
export const getOrCreateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing;
    }

    const id = await ctx.db.insert("users", {
      ...args,
      signedInAt: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});
