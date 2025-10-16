import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user's ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) {
      console.log("No user ID found - user not authenticated");
      return null; // Explicitly return null when not authenticated
    }
    
    console.log("User authenticated with ID:", userId);
    return userId;
  },
});
