# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the TanStack Start + React application to Vercel. The application uses Supabase for authentication and backend services, and is configured to run on Vercel's Node.js runtime.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
3. [Step 2: Connect Repository to Vercel](#step-2-connect-repository-to-vercel)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
6. [Step 5: Verify Deployment](#step-5-verify-deployment)
7. [Understanding vercel.json Configuration](#understanding-verceljson-configuration)
8. [Build and Deployment Process Flow](#build-and-deployment-process-flow)
9. [Troubleshooting Common Issues](#troubleshooting-common-issues)
10. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

- A GitHub, GitLab, or Bitbucket repository with your application code
- A Vercel account (free tier available at [vercel.com](https://vercel.com))
- Access to your Supabase project credentials:
  - Supabase URL
  - Supabase Publishable Key (anon key)
  - Supabase Service Role Key (secret key)
- Node.js 18+ installed locally (for testing builds)
- Git configured and your repository pushed to a remote

### Obtaining Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public**: This is your `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **service_role secret**: This is your `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 1: Prepare Your Repository

### 1.1 Verify Local Build Works

Before deploying, ensure your application builds successfully locally:

```bash
# Install dependencies
npm install

# Run the build
npm run build

# Verify dist/ directory was created
ls -la dist/
```

You should see:
- `dist/server/` - Server bundle for Node.js runtime
- `dist/client/` - Client-side assets (JavaScript, CSS, HTML)
- Other build artifacts

### 1.2 Verify Configuration Files

Ensure the following files are in your repository root:

**vercel.json** - Vercel deployment configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

**vite.config.ts** - Vite build configuration (should NOT contain Cloudflare references)
```typescript
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
```

### 1.3 Commit and Push Changes

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Prepare for Vercel deployment"

# Push to your remote repository
git push origin main
```

---

## Step 2: Connect Repository to Vercel

### 2.1 Create a Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in to your account
2. Click **"Add New..."** → **"Project"**
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Vercel to access your repositories
5. Select your repository from the list
6. Click **"Import"**

### 2.2 Configure Project Settings

On the import screen, you'll see project settings:

- **Project Name**: Choose a name for your Vercel project (e.g., "my-app")
- **Framework Preset**: Should auto-detect as "Vite"
- **Root Directory**: Leave as default (`.`)
- **Build Command**: Should be `npm run build`
- **Output Directory**: Should be `dist`

**Do NOT add environment variables yet** — we'll do that in the next step.

### 2.3 Complete Import

Click **"Deploy"** to create the project. Vercel will now:
1. Clone your repository
2. Detect the configuration from `vercel.json`
3. Attempt to build the project (this will fail without environment variables)

This is expected — we'll fix it by adding environment variables in the next step.

---

## Step 3: Configure Environment Variables

### 3.1 Access Environment Variables Settings

1. In your Vercel project dashboard, go to **Settings**
2. Click **"Environment Variables"** in the left sidebar
3. You should see a form to add new environment variables

### 3.2 Add Build-Time Variables

These variables are injected into the client bundle during the build process.

**Add VITE_SUPABASE_URL:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL (e.g., `https://xecepxhokmzmuoacqtba.supabase.co`)
- **Environments**: Select all (Production, Preview, Development)
- Click **"Save"**

**Add VITE_SUPABASE_PUBLISHABLE_KEY:**
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: Your Supabase anon/publishable key (starts with `sb_anon_` or similar)
- **Environments**: Select all (Production, Preview, Development)
- Click **"Save"**

### 3.3 Add Runtime Variables

These variables are available to the server at runtime but are NOT injected into the client bundle.

**Add SUPABASE_SERVICE_ROLE_KEY:**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase service role key (secret key)
- **Environments**: Select all (Production, Preview, Development)
- Click **"Save"**

### 3.4 Verify Environment Variables

After adding all variables, your Environment Variables page should show:

| Name | Value | Environments |
|------|-------|--------------|
| VITE_SUPABASE_URL | `https://xecepxhokmzmuoacqtba.supabase.co` | Production, Preview, Development |
| VITE_SUPABASE_PUBLISHABLE_KEY | `sb_anon_...` | Production, Preview, Development |
| SUPABASE_SERVICE_ROLE_KEY | `eyJhbGc...` | Production, Preview, Development |

---

## Step 4: Deploy to Vercel

### 4.1 Trigger a New Deployment

Now that environment variables are configured, you have two options:

**Option A: Redeploy from Dashboard**
1. Go to your Vercel project dashboard
2. Click **"Deployments"** tab
3. Find the failed deployment (marked with a red X)
4. Click the three dots menu and select **"Redeploy"**
5. Vercel will rebuild with the new environment variables

**Option B: Push a New Commit**
1. Make a small change to your repository (e.g., update a comment)
2. Commit and push:
   ```bash
   git commit --allow-empty -m "Trigger Vercel deployment"
   git push origin main
   ```
3. Vercel will automatically detect the push and start a new deployment

### 4.2 Monitor the Deployment

1. Go to the **"Deployments"** tab in your Vercel project
2. Click on the latest deployment to view build logs
3. Watch for the build to complete (should take 1-3 minutes)
4. Once complete, you'll see a green checkmark and a deployment URL

### 4.3 Access Your Deployed Application

Once the deployment is complete:
1. Click the deployment URL (e.g., `https://my-app.vercel.app`)
2. Your application should load in the browser
3. Test the functionality to ensure everything works

---

## Understanding vercel.json Configuration

The `vercel.json` file in your project root tells Vercel how to build and deploy your application. Here's what each setting does:

### Configuration Breakdown

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

#### buildCommand
- **What it does**: Specifies the command Vercel runs to build your application
- **Value**: `npm run build`
- **Why**: This command runs Vite to compile your React components and TanStack Start server
- **When it runs**: During the build phase, before deployment

#### outputDirectory
- **What it does**: Tells Vercel where to find the compiled application
- **Value**: `dist`
- **Why**: Vite outputs all compiled files to the `dist/` directory
- **What's inside**: 
  - `dist/server/` - Server bundle for Node.js
  - `dist/client/` - Client-side assets
  - Static files and other build artifacts

#### framework
- **What it does**: Tells Vercel which framework you're using
- **Value**: `vite`
- **Why**: Vercel optimizes deployment for Vite-based applications
- **Benefits**: Automatic optimizations, better error messages, faster deployments

#### env (Environment Variables)
- **What it does**: Maps environment variable names to Vercel secrets
- **Format**: `"VARIABLE_NAME": "@secret_name"`
- **The @ prefix**: Tells Vercel to use a secret with that name
- **Build-time variables** (VITE_ prefix):
  - `VITE_SUPABASE_URL` - Injected into client bundle during build
  - `VITE_SUPABASE_PUBLISHABLE_KEY` - Injected into client bundle during build
- **Runtime variables** (no VITE_ prefix):
  - `SUPABASE_SERVICE_ROLE_KEY` - Available to server at runtime only

### How Environment Variables Work

**Build-Time (VITE_ prefix):**
1. Vercel reads `VITE_SUPABASE_URL` from secrets
2. During `npm run build`, Vite injects this value into the client bundle
3. The value becomes part of the compiled JavaScript
4. Client-side code can access it via `import.meta.env.VITE_SUPABASE_URL`

**Runtime (no VITE_ prefix):**
1. Vercel reads `SUPABASE_SERVICE_ROLE_KEY` from secrets
2. Makes it available as an environment variable in the Node.js process
3. Server-side code can access it via `process.env.SUPABASE_SERVICE_ROLE_KEY`
4. The value is NOT included in the client bundle (stays secret)

---

## Build and Deployment Process Flow

Understanding the deployment process helps you troubleshoot issues and optimize your workflow.

### Complete Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Git Push / Manual Trigger                                │
│    Developer pushes code or clicks "Redeploy"               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Vercel Detects Change                                    │
│    Vercel webhook receives notification                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Read Configuration                                       │
│    Vercel reads vercel.json from repository                 │
│    - buildCommand: npm run build                            │
│    - outputDirectory: dist                                  │
│    - framework: vite                                        │
│    - env: {...}                                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Load Environment Variables                               │
│    Vercel retrieves secrets from dashboard:                 │
│    - VITE_SUPABASE_URL                                      │
│    - VITE_SUPABASE_PUBLISHABLE_KEY                          │
│    - SUPABASE_SERVICE_ROLE_KEY                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Build Phase (npm run build)                              │
│    ├─ Vite reads vite.config.ts                             │
│    ├─ Compiles React components                             │
│    ├─ Injects VITE_* variables into client bundle           │
│    ├─ Bundles server entry point (src/server.ts)            │
│    ├─ Generates dist/ directory with:                       │
│    │  ├─ dist/server/ (Node.js bundle)                      │
│    │  ├─ dist/client/ (Browser assets)                      │
│    │  └─ Static files                                       │
│    └─ Build completes (1-3 minutes)                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Deploy to Node.js Runtime                                │
│    ├─ Vercel uploads dist/ to edge servers                  │
│    ├─ Starts Node.js process                                │
│    ├─ Loads server bundle from dist/server/                 │
│    ├─ Server exports default fetch handler                  │
│    └─ Ready to receive requests                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Application Running                                      │
│    ├─ Incoming HTTP request                                 │
│    ├─ Server calls fetch(request, env, ctx)                 │
│    ├─ TanStack Start renders React components               │
│    ├─ Server-side code accesses SUPABASE_SERVICE_ROLE_KEY   │
│    ├─ Client-side code accesses VITE_SUPABASE_* variables   │
│    ├─ Response sent to browser                              │
│    └─ Browser hydrates with React                           │
└─────────────────────────────────────────────────────────────┘
```

### Key Phases Explained

#### Phase 1: Detection
- Vercel monitors your Git repository for changes
- When a push is detected, Vercel automatically starts a deployment
- Alternatively, you can manually trigger a deployment from the dashboard

#### Phase 2: Configuration
- Vercel reads `vercel.json` to understand your project structure
- It learns the build command, output directory, and framework
- This tells Vercel exactly how to build your application

#### Phase 3: Environment Setup
- Vercel retrieves all environment variables from the dashboard
- These are injected into the build environment
- VITE_* variables will be embedded in the client bundle
- Other variables are available to the server at runtime

#### Phase 4: Build
- Vercel runs `npm run build` in a clean environment
- Vite compiles your React components and TanStack Start
- The server entry point (src/server.ts) is bundled for Node.js
- All output goes to the `dist/` directory
- This phase typically takes 1-3 minutes

#### Phase 5: Deployment
- Vercel uploads the `dist/` directory to its edge servers
- A Node.js process is started to run your server
- The server is ready to handle incoming requests
- Your application is now live at the deployment URL

#### Phase 6: Runtime
- When a user visits your application, an HTTP request is sent
- The server's `fetch` handler processes the request
- React components are rendered on the server (SSR)
- The rendered HTML is sent to the browser
- The browser hydrates the React components for interactivity

### Environment Variable Injection Timeline

**Build Time:**
```
npm run build
  ↓
Vite reads vite.config.ts
  ↓
Vite reads VITE_SUPABASE_URL from process.env
  ↓
Vite injects value into client bundle
  ↓
Client code can access via import.meta.env.VITE_SUPABASE_URL
```

**Runtime:**
```
Node.js process starts
  ↓
process.env contains SUPABASE_SERVICE_ROLE_KEY
  ↓
Server code can access via process.env.SUPABASE_SERVICE_ROLE_KEY
  ↓
Server uses it for privileged Supabase operations
```

---

## Troubleshooting Common Issues

### Issue 1: Build Fails with "Cannot find module" Error

**Symptoms:**
- Deployment fails during build phase
- Error message: `Cannot find module '@cloudflare/vite-plugin'` or similar

**Cause:**
- Cloudflare-specific dependencies are still in package.json
- The project hasn't been fully migrated from Cloudflare Workers

**Solution:**
1. Verify `package.json` does NOT contain `@cloudflare/vite-plugin`
2. Verify `vite.config.ts` does NOT reference Cloudflare
3. Run `npm install` locally to update dependencies
4. Commit and push changes
5. Redeploy from Vercel dashboard

### Issue 2: Environment Variables Not Found

**Symptoms:**
- Application loads but shows errors about missing Supabase credentials
- Error message: `VITE_SUPABASE_URL is undefined` or similar

**Cause:**
- Environment variables not added to Vercel dashboard
- Variables added but deployment happened before they were set

**Solution:**
1. Go to Vercel project → Settings → Environment Variables
2. Verify all three variables are present:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. If missing, add them (see Step 3)
4. Click "Redeploy" on the latest deployment
5. Wait for the new build to complete

### Issue 3: Supabase Authentication Not Working

**Symptoms:**
- Login page loads but authentication fails
- Error message: `Invalid API key` or `Unauthorized`

**Cause:**
- Incorrect Supabase credentials
- Service role key used on client instead of publishable key
- Supabase project URL is wrong

**Solution:**
1. Verify credentials in Vercel Environment Variables:
   - `VITE_SUPABASE_URL` should be your project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` should be the anon/publishable key
   - `SUPABASE_SERVICE_ROLE_KEY` should be the service role key
2. Double-check credentials in Supabase dashboard (Settings → API)
3. Update variables if needed
4. Redeploy from Vercel dashboard

### Issue 4: "dist" Directory Not Found

**Symptoms:**
- Deployment fails with error about missing output directory
- Error message: `Output directory "dist" not found`

**Cause:**
- Build command failed silently
- `vite.config.ts` is misconfigured
- Missing dependencies

**Solution:**
1. Check build logs in Vercel dashboard for errors
2. Run `npm run build` locally to reproduce the issue
3. Fix any build errors locally
4. Verify `vite.config.ts` is correct (see Step 1.2)
5. Commit and push changes
6. Redeploy from Vercel dashboard

### Issue 5: Server Crashes After Deployment

**Symptoms:**
- Deployment succeeds but application doesn't load
- Error message: `502 Bad Gateway` or similar

**Cause:**
- Server entry point (src/server.ts) is misconfigured
- Missing error handling
- Runtime error in server code

**Solution:**
1. Check Vercel deployment logs for error messages
2. Verify `src/server.ts` exports a default object with a `fetch` method
3. Verify error handling is in place
4. Test locally with `npm run build && npm run preview`
5. Fix any errors and redeploy

### Issue 6: Slow Build Times

**Symptoms:**
- Build takes longer than expected (>5 minutes)
- Deployment is slow

**Cause:**
- Large dependencies
- Inefficient build configuration
- Network issues

**Solution:**
1. Check build logs for slow steps
2. Verify `vite.config.ts` doesn't have unnecessary plugins
3. Consider using `npm ci` instead of `npm install` for faster installs
4. Check Vercel's build analytics in the dashboard
5. Contact Vercel support if issues persist

### Issue 7: Static Assets Not Loading

**Symptoms:**
- Application loads but CSS/images are missing
- Browser console shows 404 errors for assets

**Cause:**
- Incorrect asset paths
- Build output structure is wrong
- Vercel not serving static files correctly

**Solution:**
1. Verify `dist/client/` contains all assets
2. Check asset paths in HTML (should be relative)
3. Verify `outputDirectory` in `vercel.json` is set to `dist`
4. Check Vercel deployment logs for asset serving errors
5. Redeploy if needed

---

## Post-Deployment Verification

After your application is deployed, verify everything is working correctly.

### 1. Application Loads

1. Visit your deployment URL (e.g., `https://my-app.vercel.app`)
2. Verify the page loads without errors
3. Check browser console for any JavaScript errors
4. Verify all UI elements are visible and styled correctly

### 2. Supabase Authentication

1. Navigate to the login page
2. Attempt to sign up with a test email
3. Verify the authentication flow works
4. Check that user data is stored in Supabase
5. Verify you can log in with the test account

### 3. Backend API Calls

1. Test any API endpoints your application uses
2. Verify data is retrieved from Supabase
3. Check that server-side operations work correctly
4. Monitor Vercel logs for any errors

### 4. Performance

1. Check page load time (should be <3 seconds)
2. Verify no console errors or warnings
3. Check Network tab in browser DevTools for slow requests
4. Monitor Vercel Analytics for performance metrics

### 5. Error Handling

1. Intentionally trigger an error (e.g., invalid route)
2. Verify error page displays correctly
3. Check that errors are logged appropriately
4. Verify error recovery works

### 6. Environment Variables

1. Verify client-side code can access `VITE_SUPABASE_URL`
2. Verify server-side code can access `SUPABASE_SERVICE_ROLE_KEY`
3. Check that no secrets are exposed in client bundle
4. Verify all integrations work correctly

### 7. Monitoring and Logs

1. Go to Vercel project → Deployments
2. Click on your deployment to view logs
3. Check for any warnings or errors
4. Monitor the application over time for issues

---

## Next Steps

### Continuous Deployment

Your application is now set up for continuous deployment:
- Every push to your main branch triggers a new deployment
- Vercel automatically builds and deploys your changes
- You can preview changes before merging to main using preview deployments

### Custom Domain

To use a custom domain:
1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for DNS to propagate (usually 24 hours)

### Monitoring and Analytics

Vercel provides built-in monitoring:
1. Go to Vercel project → Analytics
2. Monitor page load times, Core Web Vitals, and other metrics
3. Set up alerts for performance issues
4. Use this data to optimize your application

### Scaling and Performance

As your application grows:
1. Monitor build times and optimize if needed
2. Consider using Vercel's Edge Functions for API routes
3. Implement caching strategies for better performance
4. Use Vercel's analytics to identify bottlenecks

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Deployment Best Practices](https://vercel.com/docs/deployments/best-practices)

---

## Support

If you encounter issues not covered in this guide:

1. Check Vercel deployment logs for error messages
2. Review the troubleshooting section above
3. Check the application's error logs
4. Contact Vercel support at [vercel.com/support](https://vercel.com/support)
5. Check Supabase documentation for authentication issues

---

**Last Updated**: 2025
**Deployment Target**: Vercel (Node.js Runtime)
**Framework**: TanStack Start + React
**Build Tool**: Vite
