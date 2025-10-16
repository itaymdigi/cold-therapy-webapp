import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // User authentication and profile
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    signedInAt: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("email", ["email"]),

  // User preferences from onboarding
  userPreferences: defineTable({
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
  }).index("by_user", ["userId"]),

  // Wellness sessions
  sessions: defineTable({
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
    technique: v.optional(v.string()), // For breathing sessions
    temperature: v.optional(v.number()), // For temperature-based sessions
    mood: v.optional(v.string()),
    notes: v.optional(v.string()),
    intensity: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "completedAt"]),

  // App settings (language, theme, etc.)
  appSettings: defineTable({
    userId: v.string(),
    language: v.union(v.literal("en"), v.literal("he")),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
  }).index("by_user", ["userId"]),
});
