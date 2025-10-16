# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Missing CONVEX_DEPLOY_KEY

Your Vercel build is failing because the `CONVEX_DEPLOY_KEY` is not set.

---

## Step 1: Get Your Convex Deploy Key

Run this command locally:

```bash
npx convex deploy --preview-create temp
```

Or get it from the Convex dashboard:
1. Go to: https://dashboard.convex.dev/t/itay-8b9c9/cold-therapy-webapp/settings
2. Click **Deploy Keys**
3. Click **Generate Production Deploy Key**
4. Copy the key (starts with `prod:...`)

---

## Step 2: Add to Vercel Environment Variables

### **Go to Vercel Settings:**
https://vercel.com/itays-projects-59ed51b9/cold-therapy-webapp/settings/environment-variables

### **Add These Variables:**

#### **1. CONVEX_DEPLOY_KEY** (Required for build)
- **Name:** `CONVEX_DEPLOY_KEY`
- **Value:** `prod:...` (from Step 1)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### **2. VITE_CONVEX_URL** (Required for runtime)
- **Name:** `VITE_CONVEX_URL`
- **Value:** `https://fiery-bloodhound-338.convex.cloud`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

---

## Step 3: Redeploy

After adding the environment variables:

### **Option 1: Redeploy from Vercel Dashboard**
1. Go to: https://vercel.com/itays-projects-59ed51b9/cold-therapy-webapp
2. Click **Deployments**
3. Click the three dots on the latest deployment
4. Click **Redeploy**

### **Option 2: Redeploy from CLI**
```bash
vercel deploy --prod
```

---

## How the Build Works

```
1. Vercel starts build
   ↓
2. Runs: npx convex deploy --cmd 'npm run build'
   ↓
3. Convex uses CONVEX_DEPLOY_KEY to authenticate
   ↓
4. Convex deploys functions
   ↓
5. Convex generates TypeScript types in convex/_generated/
   ↓
6. Convex runs: npm run build (Vite build)
   ↓
7. Vite uses VITE_CONVEX_URL for runtime
   ↓
8. Build succeeds! ✅
```

---

## Quick Command to Get Deploy Key

```bash
# This will show your production deploy key
npx convex deploy --dry-run
```

Look for output like:
```
Using deploy key: prod:abc123...
```

---

## Troubleshooting

### **Error: "Could not resolve ../convex/_generated/api"**

**Cause:** `CONVEX_DEPLOY_KEY` not set in Vercel

**Solution:** Add the deploy key to Vercel environment variables (see Step 2)

### **Error: "Invalid deploy key"**

**Cause:** Wrong deploy key or expired

**Solution:** Generate a new deploy key from Convex dashboard

### **Build succeeds but app shows errors**

**Cause:** `VITE_CONVEX_URL` not set

**Solution:** Add `VITE_CONVEX_URL` to Vercel environment variables

---

## Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `CONVEX_DEPLOY_KEY` | `prod:...` | Build-time: Deploy Convex functions |
| `VITE_CONVEX_URL` | `https://fiery-bloodhound-338.convex.cloud` | Runtime: Connect to Convex |

---

## After Setting Environment Variables

1. ✅ Add both environment variables to Vercel
2. ✅ Redeploy
3. ✅ Build will succeed
4. ✅ App will work!

---

**The build will work once you add the `CONVEX_DEPLOY_KEY` to Vercel!** 🚀
