# Netlify CLI Deployment Guide

## Prerequisites

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

## Deployment Steps

### Option 1: Deploy from Frontend Directory

```bash
cd wedplano/frontend
npm install
npm run build
netlify deploy --prod
```

When prompted:
- Choose "Create & configure a new site" or select existing site
- Team: Select your team
- Site name: Enter a unique name (e.g., wedplano-app)
- Publish directory: `dist`

### Option 2: Deploy from Root Directory

```bash
cd wedplano
netlify deploy --prod --dir=frontend/dist
```

### Option 3: One-Command Deployment

From the frontend directory:
```bash
cd wedplano/frontend
npm install && npm run build && netlify deploy --prod --dir=dist
```

## Environment Variables

Set environment variables in Netlify:

```bash
netlify env:set VITE_API_URL "https://wedplano-production.up.railway.app/api"
```

Or via Netlify UI:
1. Go to Site settings > Environment variables
2. Add: `VITE_API_URL` = `https://wedplano-production.up.railway.app/api`

## Continuous Deployment (Optional)

Link your repository for automatic deployments:

```bash
cd wedplano/frontend
netlify init
```

Follow the prompts to:
- Connect to your Git repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Base directory: `wedplano/frontend`

## Verify Deployment

After deployment, test your site:
- Check the provided Netlify URL
- Verify API connectivity
- Test authentication flow
- Check all routes work (SPA routing)

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues
- Verify VITE_API_URL is set correctly
- Check CORS settings on backend
- Ensure backend is accessible from Netlify

### 404 on Routes
- Verify `netlify.toml` has redirect rules
- Check that `dist` folder contains `index.html`

## Quick Reference

```bash
# Deploy draft (preview)
netlify deploy

# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open:site

# View deployment logs
netlify logs

# Check site status
netlify status
```
