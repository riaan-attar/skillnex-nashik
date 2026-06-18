# Vercel Deployment Guide

This branch (`beta`) is configured for Vercel deployment.

## Configuration Files Added

- **vercel.json** - Main Vercel configuration
- **.vercelignore** - Files to exclude from Vercel builds

## Deployment Steps

### 1. Install Vercel CLI (Optional, for local testing)
```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Choose the `beta` branch
5. Vercel will auto-detect settings from `vercel.json`
6. Click "Deploy"

### 3. Deploy via Vercel CLI
```bash
# From project root
vercel

# For production
vercel --prod
```

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

- `NODE_ENV=production`
- Any other required env vars from `.env`

## Build Output

- **Client**: `dist/client`
- **Server**: `dist/server`

## Notes

- Builds run: `npm run build`
- NodeJS 18.x runtime configured
- 1024MB memory allocated
- Automatic caching for `/assets/*` (31536000s)
- HTML files cached for 3600s

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel Dashboard
2. Verify `npm run build` works locally: `npm run build`
3. Ensure all env variables are set
4. Check node_modules are excluded from git

## Switching Between Branches

- **main**: Cloudflare deployment
- **beta**: Vercel deployment

```bash
# Switch to beta
git checkout beta

# Switch to main
git checkout main
```
