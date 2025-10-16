import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new session
export const createSession = mutation({
  args: {
    userId: v.string(),
    duration: v.number(),
    completedAt: v.string(),
    type: v.union(
      v.literal("ice-bath"),
      v.literal("breathing"),
      v.literal("sauna"),
      v.literal("jacuzzi"),
      v.literal("cold-plunge"),
      v.literal("contrast-therapy")
    ),
    technique: v.optional(v.string()),
    temperature: v.optional(v.number()),
    mood: v.optional(v.string()),
    notes: v.optional(v.string()),
    intensity: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

// Get all sessions for a user
export const getUserSessions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Update a session
export const updateSession = mutation({
  args: {
    id: v.id("sessions"),
    duration: v.optional(v.number()),
    mood: v.optional(v.string()),
    notes: v.optional(v.string()),
    temperature: v.optional(v.number()),
    intensity: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete a session
export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
