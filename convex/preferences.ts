import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save or update user preferences
export const savePreferences = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    experience: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    goals: v.array(v.string()),
    preferredDuration: v.number(),
    interests: v.array(
      v.union(v.literal("cold-therapy"), v.literal("breathing"))
    ),
    onboardingCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", args);
  },
});

// Get user preferences
export const getPreferences = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
