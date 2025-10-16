# 🚨 Immediate Fix - Stuck on Loading Screen

## Problem
You're stuck on the loading/home screen with no option to sign in as a new user.

## Root Cause
The app is trying to check if you're authenticated, but the authentication system isn't properly configured for **local development**.

---

## Solution: Add Local Development Redirect URI

### **Step 1: Add Local Redirect URI to Google Cloud Console**

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client:**
   - Client ID: `271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com`

3. **Click to edit it**

4. **Add this redirect URI:**
   ```
   https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google
   ```

5. **Click SAVE**

### **Step 2: Clear Browser Cache**

1. Open your app: http://localhost:5173
2. Press `Ctrl + Shift + R` (hard refresh)
3. Or try in **Incognito mode**

### **Step 3: Restart Dev Server**

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

---

## What Should Happen Now

1. **App loads** → You should see the **Auth/Sign-in screen** (not a loading spinner)
2. **Click "Sign in with Google"** → Redirects to Google
3. **Approve** → Redirects back to your app
4. **You're signed in!** → See the main app

---

## If You Still See Loading Screen

### **Check Browser Console (F12)**

Open the browser console and look for:
- `AppWrapper - userId: null` → Good! Should show Auth screen
- `AppWrapper - userId: undefined` → Bad! Query is stuck
- Any error messages

### **Quick Test**

Open browser console and type:
```javascript
localStorage.clear()
location.reload()
```

This clears all local storage and reloads the page.

---

## Current Redirect URIs Needed

Your Google OAuth should have **ALL** these:

### **For Local Development (localhost)**
```
https://quiet-wildebeest-702.convex.cloud/api/auth/callback/google
```

### **For Production (Vercel)**
```
https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google
https://fiery-bloodhound-338.convex.site/api/auth/callback/google
```

---

## Debugging Steps

### **1. Check what the app sees:**

Open browser console (F12) and check:
```javascript
// Should show your Convex URL
console.log(import.meta.env.VITE_CONVEX_URL)

// Should show: https://quiet-wildebeest-702.convex.cloud
```

### **2. Check Convex connection:**

In browser console:
```javascript
// Check if Convex is connected
window.convex
```

Should show a Convex client object.

---

## What I Fixed

1. **Updated `convex/helpers.ts`** - Now explicitly returns `null` when not authenticated
2. **Deployed to dev** - Changes are live on your local Convex

---

## Next Steps

1. ✅ Add local redirect URI to Google Cloud Console
2. ✅ Hard refresh browser (`Ctrl + Shift + R`)
3. ✅ You should see the Auth screen
4. ✅ Click "Sign in with Google"
5. ✅ Complete OAuth flow
6. ✅ You're in!

---

**After adding the redirect URI, you should see the sign-in screen!** 🚀

If you still have issues, share:
- Screenshot of what you see
- Browser console output (F12)
- Any error messages
