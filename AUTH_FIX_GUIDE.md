# 🔧 Authentication Fix Guide

## Problem
- Cannot sign in with Google
- `authSessions` table is empty in Convex
- Sign-in button doesn't work

## Root Cause
The Google OAuth redirect URIs are not configured for **local development**.

---

## Solution: Add Local Development Redirect URI

### **Step 1: Get Your Local Convex URL**

Your local Convex deployment URL is:
```
https://quiet-wildebeest-702.convex.cloud
```

### **Step 2: Add Redirect URI to Google Cloud Console**

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client ID:**
   - Client ID: `271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com`

3. **Click on the OAuth client to edit it**

4. **Add this EXACT redirect URI to "Authorized redirect URIs":**
   ```
   https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google
   ```

5. **Click SAVE**

### **Step 3: Verify Current Redirect URIs**

Your Google OAuth should have these redirect URIs:
- ✅ `https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google` (production)
- ✅ `https://fiery-bloodhound-338.convex.site/api/auth/callback/google` (production)
- ⚠️ `https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google` (local dev - ADD THIS!)

---

## Testing the Fix

### **1. Restart Your Dev Server**

```bash
# Stop any running dev servers (Ctrl+C)

# Start fresh
npm run dev
```

### **2. Test Sign-In**

1. Open your app: http://localhost:5173
2. Click "Sign in with Google"
3. You should be redirected to Google's consent screen
4. After approving, you'll be redirected back to your app
5. You should be signed in! 🎉

### **3. Verify in Convex Dashboard**

1. Open: https://dashboard.convex.dev/d/quiet-wildebeest-702
2. Go to "Data" → "authSessions"
3. You should see your session!

---

## Common Errors & Solutions

### **Error: "redirect_uri_mismatch"**

**Cause:** The redirect URI in Google Cloud Console doesn't match exactly.

**Solution:**
- Make sure you added the EXACT URI: `https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google`
- No trailing slash
- Must be HTTPS
- Must match your Convex deployment URL

### **Error: "400 Bad Request"**

**Cause:** Environment variables not set.

**Solution:**
```bash
# Verify environment variables are set
npx convex env list
```

Should show:
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

### **Sessions Still Empty**

**Cause:** OAuth flow not completing.

**Solution:**
1. Check browser console for errors
2. Verify redirect URI is correct
3. Clear browser cache and cookies
4. Try incognito mode

---

## What Was Fixed

### **1. Updated `convex/auth.ts`**
Added explicit Google OAuth credentials:
```typescript
Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
})
```

### **2. Verified Environment Variables**
Confirmed these are set in Convex:
- ✅ `AUTH_GOOGLE_ID`
- ✅ `AUTH_GOOGLE_SECRET`

### **3. Verified HTTP Routes**
Confirmed `convex/http.ts` has auth routes configured.

---

## Next Steps After Sign-In Works

1. ✅ Test creating a session
2. ✅ Verify data appears in Convex dashboard
3. ✅ Test sign-out and sign-in again
4. ✅ Complete onboarding flow
5. ✅ Test data persistence

---

## Quick Reference

### **Local Development URLs**
- App: http://localhost:5173
- Convex: https://quiet-wildebeest-702.convex.cloud
- Dashboard: https://dashboard.convex.dev/d/quiet-wildebeest-702

### **Production URLs**
- App: https://cold-therapy-webapp.vercel.app
- Convex: https://fiery-bloodhound-338.convex.cloud
- Dashboard: https://dashboard.convex.dev/d/fiery-bloodhound-338

### **Google OAuth**
- Console: https://console.cloud.google.com/apis/credentials
- Client ID: 271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com

---

## Commands

```bash
# Start dev server
npm run dev

# Deploy to Convex
npx convex dev

# Check environment variables
npx convex env list

# View dashboard
npx convex dashboard
```

---

**After adding the redirect URI to Google Cloud Console, sign-in should work!** 🚀
