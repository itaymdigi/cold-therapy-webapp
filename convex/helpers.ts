import { query } from "./_generated/server";
import { auth } from "./auth";

// Get the current authenticated user's ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId;
  },
});
