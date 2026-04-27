# Wedplano - Deployment Documentation

## 📋 Overview

This project is configured for deployment with:
- **Backend**: Railway (Node.js/Express API)
- **Frontend**: Netlify (React/Vite SPA)
- **Database**: Firebase Firestore
- **Storage**: Cloudinary

## 🚀 Quick Start

### Prerequisites
```bash
npm install -g @railway/cli netlify-cli
railway login
netlify login
```

### Deploy Backend
```bash
cd wedplano/backend
railway init
railway up
railway domain  # Get your backend URL
```

### Deploy Frontend
```bash
cd wedplano/frontend
echo "VITE_API_URL=https://your-backend.railway.app/api" > .env.production
npm run deploy
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step deployment instructions |
| `DEPLOYMENT_CHECKLIST.md` | Comprehensive checklist for deployment process |
| `QUICK_DEPLOY.md` | Quick reference commands for deployment |
| `ENVIRONMENT_VARIABLES.md` | All environment variables explained |
| `NETLIFY_DEPLOYMENT.md` | Netlify-specific deployment guide |

## 🔧 Configuration Files

### Backend
- `backend/.env.example` - Environment variables template
- `backend/.env.production.example` - Production environment template
- `backend/.railwayignore` - Files to exclude from Railway
- `backend/railway.toml` - Railway configuration
- `backend/Procfile` - Process configuration

### Frontend
- `frontend/.env.production` - Production environment variables
- `frontend/.env.example` - Environment variables template
- `frontend/netlify.toml` - Netlify configuration
- `frontend/vite.config.js` - Vite build configuration

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions workflow

## 🔑 Required Credentials

Before deploying, gather:
1. Firebase Admin SDK JSON (from Firebase Console)
2. Cloudinary credentials (from Cloudinary Dashboard)
3. JWT secret (generate a strong random string)

## 📖 Deployment Steps Summary

1. **Setup Accounts**
   - Create Railway account
   - Create Netlify account
   - Setup Firebase project
   - Setup Cloudinary account

2. **Deploy Backend**
   - Initialize Railway project
   - Set environment variables
   - Deploy code
   - Get backend URL

3. **Deploy Frontend**
   - Update backend URL in config
   - Build frontend
   - Deploy to Netlify
   - Get frontend URL

4. **Configure Services**
   - Update CORS in backend with frontend URL
   - Add domains to Firebase authorized domains
   - Add domains to Cloudinary allowed origins

5. **Verify**
   - Test backend health endpoint
   - Test frontend loads
   - Test authentication flow
   - Test API integration

## 🔍 Verification Commands

```bash
# Backend health check
curl https://your-backend.railway.app/health

# View backend logs
railway logs

# View frontend logs
netlify logs

# Open frontend in browser
netlify open:site
```

## 🐛 Common Issues

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches your Netlify URL exactly
- No trailing slashes
- Include protocol (https://)

### Build Failures
- Check all environment variables are set
- Verify Node.js version compatibility
- Check logs for specific errors

### API Connection Issues
- Verify `VITE_API_URL` is set in Netlify
- Check backend is running (health endpoint)
- Verify CORS configuration

## 📞 Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🔄 Redeployment

### Backend
```bash
cd wedplano/backend
railway up
```

### Frontend
```bash
cd wedplano/frontend
npm run deploy
```

## 🎯 Next Steps After Deployment

1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up automated backups
4. Configure CI/CD pipelines
5. Add analytics tracking
6. Set up error tracking (Sentry, etc.)
7. Performance monitoring
8. Security audits

## 📝 Environment Variables Checklist

### Backend (14 variables)
- [ ] PORT
- [ ] NODE_ENV
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_PRIVATE_KEY_ID
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_CLIENT_ID
- [ ] FIREBASE_AUTH_URI
- [ ] FIREBASE_TOKEN_URI
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] FRONTEND_URL

### Frontend (1 variable)
- [ ] VITE_API_URL

## 🏗️ Architecture

```
┌─────────────────┐
│   Netlify       │
│   (Frontend)    │
│   React + Vite  │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Railway       │
│   (Backend)     │
│   Node.js API   │
└────┬───────┬────┘
     │       │
     │       └──────────┐
     │                  │
┌────▼────────┐  ┌──────▼──────┐
│  Firebase   │  │  Cloudinary │
│  (Database) │  │  (Storage)  │
└─────────────┘  └─────────────┘
```

## 📄 License

See main project README for license information.
