import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user's ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      console.log("getUserId called, result:", userId);
      return userId;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  },
});
