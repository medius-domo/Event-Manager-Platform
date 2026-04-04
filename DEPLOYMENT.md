# Deployment Troubleshooting Guide

## Vercel Deployment Checklist

### 1. Environment Variables in Vercel
Make sure you have added these environment variables in your Vercel project settings:

- `VITE_SUPABASE_URL` = `https://iuckdvfmtgwnaagristw.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = Your anon public key

**Important**: After adding/updating environment variables, you MUST redeploy your project for changes to take effect.

### 2. Build Settings
In Vercel project settings, ensure:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Common Issues and Solutions

#### Blank Page Issue
If you see a blank page in production:

1. **Check Browser Console**
   - Right-click on the page and select "Inspect"
   - Go to the Console tab
   - Look for any error messages (especially about missing environment variables or failed network requests)

2. **Verify Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - After adding/changing variables, go to Deployments tab and click "Redeploy"

3. **Check Network Tab**
   - In browser DevTools, go to Network tab
   - Refresh the page
   - Check if `/locales/en.json` and `/locales/sw.json` are loading successfully (200 status)
   - Check if Supabase API calls are working

4. **Verify Supabase Connection**
   - Go to Supabase Dashboard → Your Project → Settings → API
   - Confirm the URL and anon key match what's in Vercel
   - Check if your Supabase project is active and accessible

#### CORS Errors
If you see CORS errors in the console:
- This usually means the Supabase URL or key is incorrect
- Double-check the environment variables in Vercel

#### 404 Errors for Assets
If you see 404 errors for CSS, JS, or locales:
- Make sure the build completed successfully
- Check that the `dist` folder is set as the output directory in Vercel

### 4. Testing Locally with Production Build

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

This will build and serve the production version locally. If it works here but not on Vercel, the issue is likely with environment variables or Vercel configuration.

### 5. Debugging Steps

1. **Check Vercel Build Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Review the build logs for any errors or warnings

2. **Check Function Logs**
   - In Vercel Dashboard, go to your deployment
   - Click on "Functions" or "Runtime Logs"
   - Look for any runtime errors

3. **Test Supabase Connection Directly**
   - Open browser console on your deployed site
   - Type: `localStorage.clear()` and press Enter
   - Refresh the page
   - This clears any cached data that might be causing issues

### 6. Vercel Configuration File

If issues persist, create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures proper routing for your single-page application.

## Quick Fix Checklist

- [ ] Environment variables are set in Vercel
- [ ] Environment variables start with `VITE_` prefix
- [ ] Redeployed after adding environment variables
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Supabase project is active and accessible
- [ ] Translation files load successfully (check Network tab for `/locales/en.json`)

## Still Having Issues?

If the page is still blank after checking all the above:

1. Share the error messages from the browser console
2. Check if the same issue occurs when testing locally with `npm run preview`
3. Verify that your Supabase project has the correct tables and RLS policies set up
4. Make sure your Supabase project URL is accessible from the internet
