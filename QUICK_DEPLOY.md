# Quick Deployment Commands

## One-Time Setup

```bash
# Install CLIs
npm install -g @railway/cli netlify-cli

# Login
railway login
netlify login
```

## Backend Deployment (Railway)

```bash
cd wedplano/backend

# Initialize and deploy
railway init
railway up

# Set environment variables (use your actual values)
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="your-secret-key-min-32-chars"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set FIREBASE_PROJECT_ID="your-project-id"
railway variables set FIREBASE_PRIVATE_KEY_ID="your-key-id"
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
railway variables set FIREBASE_CLIENT_EMAIL="your-email@project.iam.gserviceaccount.com"
railway variables set FIREBASE_CLIENT_ID="your-client-id"
railway variables set FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
railway variables set FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
railway variables set CLOUDINARY_API_KEY="your-api-key"
railway variables set CLOUDINARY_API_SECRET="your-api-secret"
railway variables set FRONTEND_URL="https://your-app.netlify.app"

# Get your backend URL
railway domain
```

## Frontend Deployment (Netlify)

```bash
cd wedplano/frontend

# Update backend URL in .env.production
echo "VITE_API_URL=https://your-project.up.railway.app/api" > .env.production

# Build and deploy
npm install
npm run build
netlify deploy --prod

# Set environment variable
netlify env:set VITE_API_URL "https://your-project.up.railway.app/api"
```

## Update CORS

After getting your Netlify URL, update Railway:

```bash
cd wedplano/backend
railway variables set FRONTEND_URL="https://your-actual-site.netlify.app"
```

## Verify

```bash
# Check backend
curl https://your-project.up.railway.app/health

# Check frontend
netlify open:site
```

## Redeploy

```bash
# Backend
cd wedplano/backend
railway up

# Frontend
cd wedplano/frontend
npm run build && netlify deploy --prod
```
