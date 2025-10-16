# Google OAuth Redirect URIs Setup

## ✅ Environment Variables Set

Your Google OAuth credentials are now set in Convex production:
- ✅ `AUTH_GOOGLE_ID`: 271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com
- ✅ `AUTH_GOOGLE_SECRET`: Set

## ⚠️ IMPORTANT: Add Redirect URIs to Google Cloud Console

### **Step 1: Go to Google Cloud Console**

https://console.cloud.google.com/apis/credentials

### **Step 2: Find Your OAuth 2.0 Client ID**

Look for: `271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com`

### **Step 3: Add Authorized Redirect URIs**

Click on your OAuth client and add these **exact** URIs:

```
https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google
https://fiery-bloodhound-338.convex.site/api/auth/callback/google
```

**Important:** 
- Must be HTTPS
- Must be exact match (no trailing slashes)
- Both URLs are needed

### **Step 4: Save**

Click **Save** at the bottom of the page.

---

## Test Your Setup

1. Visit: https://cold-therapy-webapp.vercel.app
2. Click "Sign in with Google"
3. You should be redirected to Google's consent screen
4. After approving, you'll be redirected back to your app
5. You should be signed in! 🎉

---

## Troubleshooting

### **Error: "redirect_uri_mismatch"**

**Solution:** The redirect URI in Google Cloud Console doesn't match exactly.

Make sure you added:
```
https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google
```

NOT:
- ❌ `http://...` (must be HTTPS)
- ❌ `.../callback/google/` (no trailing slash)
- ❌ Different domain

### **Error: "400 Bad Request"**

**Solution:** Environment variables not set correctly.

Verify they're set in production:
```bash
npx convex env list --prod
```

Should show:
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET

---

## Current Setup

### **Convex Production Deployment**
- URL: https://fiery-bloodhound-338.convex.cloud
- Dashboard: https://dashboard.convex.dev/d/fiery-bloodhound-338

### **Vercel Production**
- URL: https://cold-therapy-webapp.vercel.app

### **Google OAuth Client**
- Client ID: 271963332001-t5ha926l2cq9ctvr94gnhiqj8jk8tlgl.apps.googleusercontent.com

---

## Next Steps

1. ✅ Add redirect URIs to Google Cloud Console (see above)
2. ✅ Test sign-in on production
3. ✅ Create a session
4. ✅ Verify data in Convex dashboard

---

**After adding the redirect URIs, Google sign-in should work!** 🚀
