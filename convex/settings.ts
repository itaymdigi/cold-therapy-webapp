import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save or update app settings
export const saveSettings = mutation({
  args: {
    userId: v.string(),
    language: v.union(v.literal("en"), v.literal("he")),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("appSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("appSettings", args);
  },
});

// Get app settings
export const getSettings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
