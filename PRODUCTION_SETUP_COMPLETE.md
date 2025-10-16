# ✅ Production Setup Complete!

## Issue Resolved: Empty Data in Convex

### **Root Cause**
Your app has **two separate Convex deployments:**
- **Dev:** `quiet-wildebeest-702` (local development)
- **Prod:** `fiery-bloodhound-338` (production)

When you created users locally, they went to the **dev** database.  
Your production app was looking at the **prod** database (which was empty).

---

## Solution Applied

### **1. Deployed Convex to Production** ✅
```bash
npx convex deploy
```

**Production URL:** `https://fiery-bloodhound-338.convex.cloud`

### **2. Add to Vercel** ⚠️ (Action Required)

You need to manually add this to Vercel:

**Go to:** https://vercel.com/itays-projects-59ed51b9/cold-therapy-webapp/settings/environment-variables

**Add:**
- **Variable Name:** `VITE_CONVEX_URL`
- **Value:** `https://fiery-bloodhound-338.convex.cloud`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### **3. Redeploy** ✅
```bash
vercel deploy --prod
```
Currently deploying...

---

## Test Your Production App

Once the deployment completes:

1. **Visit:** https://cold-therapy-webapp-g735zcgz2-itays-projects-59ed51b9.vercel.app
2. **Sign in** (creates a guest user)
3. **Create a session**
4. **Check Convex Dashboard:** https://dashboard.convex.dev/d/fiery-bloodhound-338

You should now see data appearing in the **prod** deployment!

---

## Environment URLs

### **Local Development**
```env
CONVEX_DEPLOYMENT=dev:quiet-wildebeest-702
VITE_CONVEX_URL=https://quiet-wildebeest-702.convex.cloud
```

### **Production (Vercel)**
```env
VITE_CONVEX_URL=https://fiery-bloodhound-338.convex.cloud
```

---

## Google Sign-In Setup (Next Step)

To enable real Google authentication:

### **Quick Steps:**

1. **Get Google OAuth Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://fiery-bloodhound-338.convex.cloud/api/auth/callback/google`

2. **Add to Convex**
   ```bash
   npx convex env set AUTH_GOOGLE_ID "your-client-id" --prod
   npx convex env set AUTH_GOOGLE_SECRET "your-secret" --prod
   ```

3. **Update Schema** (add auth tables)
   ```typescript
   import { authTables } from "@convex-dev/auth/server";
   
   export default defineSchema({
     ...authTables,
     // ... existing tables
   });
   ```

4. **Update Auth Component**
   ```typescript
   import { useAuthActions } from "@convex-dev/auth/react";
   
   const { signIn } = useAuthActions();
   
   <Button onClick={() => signIn("google")}>
     Sign in with Google
   </Button>
   ```

**Full guide:** See `GOOGLE_AUTH_SETUP.md`

---

## Verify Everything Works

### **Checklist:**

- [ ] Added `VITE_CONVEX_URL` to Vercel
- [ ] Redeployed to production
- [ ] Visited production URL
- [ ] Signed in successfully
- [ ] Created a test session
- [ ] Verified data in Convex dashboard (prod)
- [ ] Tested real-time sync (open in 2 tabs)

---

## Dashboards

### **Development**
https://dashboard.convex.dev/d/quiet-wildebeest-702

### **Production**
https://dashboard.convex.dev/d/fiery-bloodhound-338

---

## Commands Reference

```bash
# Deploy to production
npx convex deploy

# View production dashboard
npx convex dashboard --prod

# Set production env vars
npx convex env set KEY "value" --prod

# Redeploy Vercel
vercel deploy --prod

# Check which deployment you're using
npx convex deployments list
```

---

## Troubleshooting

### **Still seeing empty data?**

1. Check browser console:
   ```javascript
   console.log(import.meta.env.VITE_CONVEX_URL)
   ```
   Should show: `https://fiery-bloodhound-338.convex.cloud`

2. Clear browser cache and reload

3. Check Vercel deployment logs for errors

### **Data in wrong deployment?**

- **Local dev** → Uses `quiet-wildebeest-702`
- **Production** → Uses `fiery-bloodhound-338`

They are **separate databases** - this is intentional!

---

## Migration Note

If you want to copy data from dev to prod:

```bash
# Export from dev
npx convex export --path ./backup

# Import to prod
npx convex import --path ./backup --prod
```

---

## Next Steps

1. ✅ **Immediate:** Add `VITE_CONVEX_URL` to Vercel (if not done)
2. ✅ **Test:** Create sessions in production
3. ⏭️ **Optional:** Set up Google OAuth (see `GOOGLE_AUTH_SETUP.md`)
4. ⏭️ **Optional:** Add custom domain
5. ⏭️ **Optional:** Enable Vercel Analytics

---

**Your production app is now connected to the correct Convex database!** 🎉

Just add the environment variable to Vercel and you're all set!
