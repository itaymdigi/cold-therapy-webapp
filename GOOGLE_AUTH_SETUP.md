# Google Sign-In & Data Sync Setup

## Current Issues

### ✅ Issue 1: Empty Data in Convex
**Problem:** Your production app is using a different Convex deployment than your local dev.

**Solution:** We need to get your production Convex URL and add it to Vercel.

### ✅ Issue 2: Enable Google Sign-In
**Problem:** Currently using mock authentication.

**Solution:** Integrate Convex Auth with Google OAuth.

---

## Quick Fix: Get Production Convex URL

### **Step 1: Deploy Convex to Production**

```bash
npx convex deploy
```

This will show output like:
```
✔ Deployment complete!
  Deployment URL: https://your-project-123.convex.cloud
```

### **Step 2: Add to Vercel Environment Variables**

1. Go to: https://vercel.com/itays-projects-59ed51b9/cold-therapy-webapp/settings/environment-variables

2. Add/Update:
   - **Name:** `VITE_CONVEX_URL`
   - **Value:** `https://your-project-123.convex.cloud` (from Step 1)
   - **Environment:** Production, Preview, Development

3. **Redeploy:**
```bash
vercel deploy --prod
```

---

## Enable Google Sign-In (Full Setup)

### **Option 1: Convex Auth (Recommended)**

#### **1. Install Convex Auth**
Already installed! ✅

#### **2. Update Convex Schema**

Add auth tables to `convex/schema.ts`:

```typescript
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // ... your existing tables
});
```

#### **3. Create Auth Functions**

Create `convex/auth.ts`:
```typescript
import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
```

#### **4. Get Google OAuth Credentials**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing)
3. Click **Create Credentials** → **OAuth client ID**
4. Application type: **Web application**
5. Authorized redirect URIs:
   ```
   https://your-convex-deployment.convex.cloud/api/auth/callback/google
   https://your-convex-deployment.convex.site/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret**

#### **5. Add to Convex Environment Variables**

```bash
# Local development
npx convex env set AUTH_GOOGLE_ID "your-client-id.apps.googleusercontent.com"
npx convex env set AUTH_GOOGLE_SECRET "your-client-secret"

# Production
npx convex env set AUTH_GOOGLE_ID "your-client-id.apps.googleusercontent.com" --prod
npx convex env set AUTH_GOOGLE_SECRET "your-client-secret" --prod
```

#### **6. Update Auth Component**

Replace `src/components/Auth.tsx` with:
```typescript
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from '@/components/ui/button';

export function Auth() {
  const { signIn } = useAuthActions();

  return (
    <Button onClick={() => signIn("google")}>
      Sign in with Google
    </Button>
  );
}
```

#### **7. Wrap App with ConvexAuthProvider**

Update `src/main.tsx`:
```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";

createRoot(document.getElementById('root')!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>
)
```

---

### **Option 2: Simple Fix (Keep Current Auth)**

If you want to keep the current mock auth and just fix the data sync:

#### **1. Check Your Deployments**

```bash
# List all deployments
npx convex deployments list
```

You should see:
- **dev:** quiet-wildebeest-702 (your local dev)
- **prod:** (your production deployment)

#### **2. Get Production URL**

```bash
npx convex deploy
```

Look for the deployment URL in the output.

#### **3. Update Vercel**

Add `VITE_CONVEX_URL` to Vercel (see Quick Fix above).

#### **4. Test**

1. Visit your production URL: https://cold-therapy-webapp-sxcw02y8e-itays-projects-59ed51b9.vercel.app
2. Sign in (creates guest user)
3. Create a session
4. Check Convex dashboard: https://dashboard.convex.dev

---

## Debugging: Check Which Deployment You're Using

### **In Browser Console:**

```javascript
// Check current Convex URL
console.log(import.meta.env.VITE_CONVEX_URL)
```

### **Expected Values:**

- **Local:** `https://quiet-wildebeest-702.convex.cloud`
- **Production:** `https://your-prod-deployment.convex.cloud`

If they're different, that's why data doesn't sync!

---

## Current Setup Status

✅ **Convex Installed**  
✅ **@convex-dev/auth Installed**  
⚠️ **Need Production Convex URL in Vercel**  
⚠️ **Need Google OAuth Credentials (optional)**

---

## Recommended Next Steps

### **Immediate Fix (5 minutes):**

1. Run: `npx convex deploy`
2. Copy the deployment URL
3. Add to Vercel as `VITE_CONVEX_URL`
4. Redeploy: `vercel deploy --prod`
5. Test: Create a session and check Convex dashboard

### **Full Google Auth (30 minutes):**

1. Get Google OAuth credentials
2. Add to Convex environment variables
3. Update schema with auth tables
4. Update Auth component
5. Test Google sign-in

---

## Quick Commands

```bash
# Deploy Convex to production
npx convex deploy

# Check deployments
npx convex deployments list

# View production data
npx convex dashboard --prod

# Set environment variables
npx convex env set KEY "value" --prod

# Redeploy Vercel
vercel deploy --prod
```

---

## Support

- **Convex Auth Docs:** https://docs.convex.dev/auth
- **Google OAuth Setup:** https://console.cloud.google.com/apis/credentials
- **Convex Discord:** https://convex.dev/community

---

**Start with the Quick Fix to get data syncing, then add Google Auth later!** 🚀
