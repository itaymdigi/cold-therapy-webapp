import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user's ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    try {
      console.log("getUserId called");
      console.log("ctx.auth:", JSON.stringify(ctx.auth));
      
      const userId = await getAuthUserId(ctx);
      console.log("getAuthUserId result:", userId);
      
      if (!userId) {
        console.log("No user ID found - user not authenticated");
      }
      
      return userId;
    } catch (error) {
      console.error("Error getting user ID:", error);
      console.error("Error details:", JSON.stringify(error));
      return null;
    }
  },
});
