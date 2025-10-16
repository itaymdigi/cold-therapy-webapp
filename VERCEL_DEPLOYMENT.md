# Vercel Deployment Guide

## Prerequisites

Before deploying, you need:
1. ✅ Convex account (already set up)
2. ✅ Vercel account
3. ✅ GitHub repository (optional but recommended)

---

## Step 1: Get Convex Deploy Key

### **Option A: Via Dashboard**
1. Go to: https://dashboard.convex.dev/t/itay-8b9c9/cold-therapy-webapp
2. Click **Settings** → **Deploy Keys**
3. Click **Generate Deploy Key**
4. Copy the key (starts with `prod:...`)

### **Option B: Via CLI**
```bash
npx convex deploy --preview-create
```
This will show your deploy key in the output.

---

## Step 2: Add Environment Variables to Vercel

### **In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `CONVEX_DEPLOY_KEY` | `prod:...` (from Step 1) | Production, Preview |
| `VITE_CONVEX_URL` | Will be set automatically by build | All |

**Important:** The `VITE_CONVEX_URL` will be automatically set during the build process by Convex.

---

## Step 3: Deploy to Vercel

### **Method 1: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel deploy --prod
```

### **Method 2: Via GitHub Integration**

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add Convex integration"
git push origin main
```

2. In Vercel dashboard:
   - Click **Add New Project**
   - Import your GitHub repository
   - Add environment variables (from Step 2)
   - Click **Deploy**

### **Method 3: Via Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your project
3. Configure:
   - **Build Command:** Leave as default (uses `vercel.json`)
   - **Install Command:** Leave as default
   - Add environment variables (from Step 2)
4. Click **Deploy**

---

## Step 4: Verify Deployment

After deployment:

1. **Check Build Logs:**
   - Look for `✔ Convex functions ready!`
   - Verify no errors in build output

2. **Test Your App:**
   - Visit your Vercel URL
   - Sign in
   - Create a session
   - Verify data saves to Convex

3. **Check Convex Dashboard:**
   - Go to: https://dashboard.convex.dev/d/quiet-wildebeest-702
   - Verify data is being saved
   - Check for any errors

---

## Build Process Explained

When you deploy to Vercel, this happens:

```
1. Vercel runs: npx convex deploy --cmd 'npm run build'
   ↓
2. Convex deploys your functions to production
   ↓
3. Convex generates TypeScript types
   ↓
4. Convex sets VITE_CONVEX_URL environment variable
   ↓
5. npm run build executes (Vite builds your app)
   ↓
6. Vercel deploys the built app
```

---

## Troubleshooting

### **Error: "Could not resolve ../convex/_generated/api"**

**Solution:** Make sure `CONVEX_DEPLOY_KEY` is set in Vercel environment variables.

### **Error: "CONVEX_DEPLOY_KEY not found"**

**Solution:**
1. Generate a deploy key from Convex dashboard
2. Add it to Vercel environment variables
3. Redeploy

### **Error: "Convex deployment failed"**

**Solution:**
1. Check your Convex dashboard for errors
2. Verify your schema is valid
3. Run `npx convex dev` locally to test

### **Data Not Syncing**

**Solution:**
1. Check browser console for errors
2. Verify `VITE_CONVEX_URL` is set correctly
3. Check Convex dashboard for function errors

---

## Environment Variables Summary

### **Local Development** (`.env.local`)
```env
CONVEX_DEPLOYMENT=dev:quiet-wildebeest-702
VITE_CONVEX_URL=https://quiet-wildebeest-702.convex.cloud
```

### **Production** (Vercel)
```env
CONVEX_DEPLOY_KEY=prod:... (from Convex dashboard)
VITE_CONVEX_URL=<auto-set-by-convex>
```

---

## Deployment Commands

```bash
# Deploy to production
vercel deploy --prod

# Deploy preview
vercel deploy

# View logs
vercel logs

# Check deployment status
vercel inspect <deployment-url>
```

---

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] User can sign in
- [ ] Sessions save to Convex
- [ ] Language switching works
- [ ] Data syncs across devices
- [ ] Real-time updates work
- [ ] No console errors
- [ ] Convex dashboard shows data

---

## Continuous Deployment

### **Automatic Deployments:**

Once connected to GitHub:
- Push to `main` → Deploys to production
- Push to other branches → Creates preview deployment
- Pull requests → Automatic preview deployments

### **Manual Deployments:**

```bash
# Deploy specific branch
vercel --prod

# Deploy with custom domain
vercel --prod --alias your-domain.com
```

---

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate auto-generated

---

## Monitoring

### **Vercel Analytics:**
- Enable in project settings
- Track page views, performance
- Monitor errors

### **Convex Monitoring:**
- Dashboard: https://dashboard.convex.dev/d/quiet-wildebeest-702
- View function execution times
- Monitor database queries
- Check error logs

---

## Rollback

If something goes wrong:

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

Or in Vercel dashboard:
1. Go to **Deployments**
2. Find working deployment
3. Click **Promote to Production**

---

## Cost Estimation

### **Convex (Free Tier):**
- ✅ 1M function calls/month
- ✅ 1GB database storage
- ✅ 1GB bandwidth

### **Vercel (Hobby Tier):**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL

**Your app should stay within free tiers for moderate usage.**

---

## Support

- **Convex:** support@convex.dev
- **Vercel:** https://vercel.com/support
- **Discord:** https://convex.dev/community

---

## Quick Deploy Checklist

1. [ ] Get Convex deploy key
2. [ ] Add `CONVEX_DEPLOY_KEY` to Vercel
3. [ ] Push code to GitHub (optional)
4. [ ] Run `vercel deploy --prod`
5. [ ] Test deployed app
6. [ ] Verify data in Convex dashboard

---

**Your app is ready to deploy!** 🚀

Just add the `CONVEX_DEPLOY_KEY` to Vercel and deploy!
