# 🔧 Vercel Production Authentication Fix

## Problem
- Can't sign in on Vercel production app
- `authSessions` table is empty
- Google OAuth not working

---

## Root Cause

Your Google OAuth redirect URIs are missing the **production Convex URL**.

---

## Solution: Add Production Redirect URI

### **Your Production Convex URL:**
```
https://fiery-bloodhound-338.convex.cloud
```

### **Step 1: Add Redirect URI to Google Cloud Console**

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client:**
   - Client ID: `271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com`

3. **Click to edit it**

4. **In "Authorized redirect URIs", add BOTH of these:**
   ```
   https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google
   https://fiery-bloodhound-338.convex.site/api/auth/callback/google
   ```

5. **Click SAVE**

---

## Step 2: Verify Convex Environment Variables

Your Convex production should have these environment variables set:

```bash
npx convex env list --prod
```

Should show:
- ✅ `AUTH_GOOGLE_ID`
- ✅ `AUTH_GOOGLE_SECRET`

If missing, set them:
```bash
npx convex env set AUTH_GOOGLE_ID "271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com" --prod
npx convex env set AUTH_GOOGLE_SECRET "GOCSPX-..." --prod
```

---

## Step 3: Redeploy

After adding the redirect URIs:

```bash
# Redeploy Convex
npx convex deploy

# Redeploy Vercel
vercel deploy --prod
```

Or redeploy from Vercel dashboard:
https://vercel.com/itays-projects-59ed51b9/cold-therapy-webapp

---

## Step 4: Test

1. **Visit your production app:**
   https://cold-therapy-webapp.vercel.app

2. **Click "Sign in with Google"**

3. **You should:**
   - Be redirected to Google consent screen
   - After approving, be redirected back to your app
   - Be signed in successfully!

4. **Verify in Convex Dashboard:**
   https://dashboard.convex.dev/d/fiery-bloodhound-338
   - Go to "Data" → "authSessions"
   - You should see your session!

---

## Complete List of Redirect URIs

Your Google OAuth should have ALL these redirect URIs:

### **Production (Convex)**
- ✅ `https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google`
- ✅ `https://fiery-bloodhound-338.convex.site/api/auth/callback/google`

### **Development (Convex)**
- ✅ `https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google`

### **Optional: Localhost (for testing)**
- `http://localhost:5173/api/auth/callback/google`

---

## Troubleshooting

### **Error: "redirect_uri_mismatch"**

**Solution:** The redirect URI must match EXACTLY.
- Check the error message for the actual URI being used
- Add that EXACT URI to Google Cloud Console
- No trailing slashes
- HTTPS only (except localhost)

### **Error: "400 Bad Request"**

**Solution:** Environment variables not set in Convex production
```bash
npx convex env list --prod
```

### **Still Not Working?**

1. **Check browser console** for errors
2. **Check Convex logs:**
   ```bash
   npx convex logs --prod
   ```
3. **Clear browser cache** and try incognito mode
4. **Verify Vercel env vars:**
   - `VITE_CONVEX_URL` = `https://fiery-bloodhound-338.convex.cloud`

---

## Environment Variables Checklist

### **Vercel Environment Variables**
- ✅ `VITE_CONVEX_URL` = `https://fiery-bloodhound-338.convex.cloud`
- ✅ `CONVEX_DEPLOY_KEY` = `prod:...`

### **Convex Production Environment Variables**
- ✅ `AUTH_GOOGLE_ID` = `271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com`
- ✅ `AUTH_GOOGLE_SECRET` = `GOCSPX-...`

### **Google Cloud Console**
- ✅ Redirect URIs added (see above)

---

## Quick Commands

```bash
# Check Convex prod env vars
npx convex env list --prod

# Deploy Convex
npx convex deploy

# Deploy Vercel
vercel deploy --prod

# View Convex logs
npx convex logs --prod

# Open Convex dashboard
npx convex dashboard --prod
```

---

## Summary

The fix is simple:
1. Add production redirect URIs to Google Cloud Console
2. Verify environment variables are set
3. Redeploy

**After adding the redirect URIs, authentication will work!** 🚀
