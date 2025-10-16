import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current authenticated user's ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    console.log("getUserId called");
    console.log("Request headers:", JSON.stringify(ctx.auth));
    
    const userId = await getAuthUserId(ctx);
    console.log("getAuthUserId result:", userId);
    
    // Debug: Check if there's an authorization header or token
    try {
      const authHeader = (ctx as any).auth?.token;
      console.log("Auth token present:", !!authHeader);
    } catch (e) {
      console.log("Could not check auth token");
    }
    
    // Also try to check the session directly
    const sessions = await ctx.db.query("authSessions").collect();
    console.log("Total sessions in DB:", sessions.length);
    if (sessions.length > 0) {
      const latestSession = sessions[sessions.length - 1];
      console.log("Latest session userId:", latestSession.userId);
      console.log("Latest session expirationTime:", latestSession.expirationTime);
    }
    
    if (!userId) {
      console.log("No user ID found - user not authenticated");
    }
    
    return userId;
  },
});
