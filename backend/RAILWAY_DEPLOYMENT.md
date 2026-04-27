# Railway Backend Deployment - Quick Guide

## Quick Deploy

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navigate to backend
cd wedplano/backend

# 4. Initialize project
railway init

# 5. Set environment variables (see below)

# 6. Deploy
railway up
```

## Required Environment Variables

Set these in Railway Dashboard or via CLI:

```bash
# Core
railway variables set NODE_ENV="production"
railway variables set PORT="5000"

# JWT
railway variables set JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters"
railway variables set JWT_EXPIRES_IN="7d"

# Firebase (get from Firebase Console > Project Settings > Service Accounts)
railway variables set FIREBASE_PROJECT_ID="your-project-id"
railway variables set FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
railway variables set FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
railway variables set FIREBASE_CLIENT_ID="your-client-id"
railway variables set FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
railway variables set FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"

# Cloudinary
railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
railway variables set CLOUDINARY_API_KEY="your-api-key"
railway variables set CLOUDINARY_API_SECRET="your-api-secret"

# Frontend URL (update after Netlify deployment)
railway variables set FRONTEND_URL="https://your-app.netlify.app"
```

## Verify Deployment

```bash
# Get your Railway URL
railway domain

# Test health endpoint
curl https://your-app.up.railway.app/health

# View API docs
# Open: https://your-app.up.railway.app/api/docs
```

## Common Commands

```bash
# View logs
railway logs

# Open dashboard
railway open

# Check status
railway status

# Redeploy
railway up
```

## Troubleshooting

**Build fails:**
- Check `railway logs`
- Verify all dependencies are in `dependencies` (not `devDependencies`)
- Ensure Node version compatibility

**Environment variables not working:**
- List variables: `railway variables`
- Redeploy after setting: `railway up`

**CORS errors:**
- Update `FRONTEND_URL` to match your Netlify URL
- No trailing slash in URL
