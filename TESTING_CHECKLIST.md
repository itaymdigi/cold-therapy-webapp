# 🧪 Authentication Testing Checklist

## ✅ What We've Verified

1. **Convex Environment Variables** ✅
   - `AUTH_GOOGLE_ID` is set
   - `AUTH_GOOGLE_SECRET` is set
   - Production deployment: `fiery-bloodhound-338`

2. **Google OAuth Redirect URIs** ✅
   - You confirmed these are added to Google Cloud Console
   - `https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google`
   - `https://fiery-bloodhound-338.convex.site/api/auth/callback/google`

3. **Convex Deployment** ✅
   - Just deployed updated `auth.ts` to production
   - Functions deployed successfully

---

## 🔍 Next Steps to Test

### **1. Test on Production (Vercel)**

Visit your production app:
```
https://cold-therapy-webapp.vercel.app
```

**Try to sign in:**
1. Click "Sign in with Google"
2. Watch what happens

**Expected behavior:**
- Redirects to Google consent screen
- After approving, redirects back to your app
- You should be signed in

**If it fails:**
- Open browser console (F12)
- Check for error messages
- Copy the exact error and share it

---

### **2. Check Convex Logs**

While testing, run this in another terminal:
```bash
npx convex logs --prod --watch
```

This will show real-time logs from your production Convex deployment.

**Look for:**
- Authentication attempts
- Error messages
- Session creation logs

---

### **3. Check authSessions Table**

After attempting to sign in:

1. Go to: https://dashboard.convex.dev/d/fiery-bloodhound-338
2. Click "Data" → "authSessions"
3. Check if any sessions were created

**If empty:**
- The OAuth flow is not completing
- Check browser console for errors
- Check Convex logs for errors

---

## 🐛 Common Issues & Solutions

### **Issue: "redirect_uri_mismatch"**

**What it means:** The redirect URI doesn't match what's in Google Cloud Console

**Solution:**
1. Look at the error message - it shows the exact URI being used
2. Go to Google Cloud Console
3. Make sure that EXACT URI is in the authorized redirect URIs
4. Save and try again

### **Issue: "400 Bad Request"**

**What it means:** OAuth configuration issue

**Possible causes:**
- Wrong Client ID or Secret
- Environment variables not loaded

**Solution:**
```bash
# Verify env vars
npx convex env list --prod

# Redeploy
npx convex deploy
```

### **Issue: Sign-in button does nothing**

**What it means:** JavaScript error or configuration issue

**Solution:**
1. Open browser console (F12)
2. Look for errors
3. Check if `VITE_CONVEX_URL` is correct:
   ```javascript
   console.log(import.meta.env.VITE_CONVEX_URL)
   ```
   Should show: `https://fiery-bloodhound-338.convex.cloud`

### **Issue: Redirects to Google but fails to come back**

**What it means:** Redirect URI not authorized

**Solution:**
- Double-check Google Cloud Console redirect URIs
- Make sure there are no typos
- No trailing slashes
- HTTPS only

---

## 📊 Debugging Commands

```bash
# Watch production logs in real-time
npx convex logs --prod --watch

# Check environment variables
npx convex env list --prod

# Open production dashboard
npx convex dashboard --prod

# Check Vercel deployment logs
vercel logs https://cold-therapy-webapp.vercel.app
```

---

## 🎯 What to Report Back

If authentication still doesn't work, please share:

1. **Browser console errors** (F12 → Console tab)
2. **Convex logs** (from `npx convex logs --prod`)
3. **What happens when you click "Sign in with Google"**
   - Does it redirect to Google?
   - Does it come back to your app?
   - Any error messages?

---

## ✅ Success Criteria

Authentication is working when:
- ✅ Click "Sign in with Google" redirects to Google
- ✅ After approving, redirects back to your app
- ✅ You see the main app (not the auth screen)
- ✅ `authSessions` table has entries in Convex dashboard
- ✅ You can create sessions and they save to Convex

---

**Try signing in now and let me know what happens!** 🚀
